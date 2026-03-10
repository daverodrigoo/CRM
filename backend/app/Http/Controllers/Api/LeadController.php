<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Lead;
use App\Models\BusinessSocialMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeadController extends Controller
{
    // GET: Fetch all leads
    public function index()
    {
        $leads = Lead::with(['business.socialMedia'])->get();
        return response()->json($leads);
    }

    // POST: Save a new lead
    public function store(Request $request)
    {
        // Start a database transaction
        DB::beginTransaction();

        try {
            // 1. Create the Business Record
            $business = Business::create([
                'Business_Name'             => $request->Business_Name,
                'Industry'                  => $request->Industry,
                'Website_Link'              => $request->Website_Link,
                'Contact_Person_First_Name' => $request->Contact_Person_First_Name,
                'Contact_Last_Name'         => $request->Contact_Last_Name,
                'Contact_Person_Phone'      => $request->Contact_Person_Phone,
                'Contact_Person_Email'      => $request->Contact_Person_Email,
                'Business_Owner_First_Name' => $request->Business_Owner_First_Name,
                'Business_Owner_Last_Name'  => $request->Business_Owner_Last_Name,
                'Business_Owner_Phone'      => $request->Business_Owner_Phone,
                'Business_Owner_Email'      => $request->Business_Owner_Email,
                'Business_Phone'            => $request->Business_Phone,
                'Business_Email'            => $request->Business_Email,
            ]);

            // 2. Create the Lead Record
            $lead = Lead::create([
                'Lead_ID'         => $request->Lead_ID,
                'Business_ID'     => $business->Business_ID, // Use the ID from the newly created business
                'Date_Added'      => $request->Date_Added,
                'Source'          => $request->Source,
                'Tab_Category'    => $request->Tab_Category,
                'Solution_Needed' => $request->Solution_Needed,
                'Remarks'         => $request->Remarks,
            ]);

            // 3. Create Social Media Records (if any exist)
            if ($request->has('Social_Media') && is_array($request->Social_Media)) {
                foreach ($request->Social_Media as $url) {
                    if (!empty(trim($url))) {
                        BusinessSocialMedia::create([
                            'Business_ID' => $business->Business_ID,
                            'URL'         => trim($url),
                        ]);
                    }
                }
            }

            // Commit the transaction (save everything permanently)
            DB::commit();

            return response()->json(['message' => 'Lead successfully saved!', 'lead' => $lead], 201);

        } catch (\Exception $e) {
            // If anything fails, rollback the whole transaction so we don't get partial data
            DB::rollBack();
            return response()->json(['error' => 'Failed to save lead: ' . $e->getMessage()], 500);
        }
    }
}