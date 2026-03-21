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
    // --- HELPER: Aggressive String Sanitizer to prevent SQL Array Errors ---
    private function safeString($value)
    {
        if (is_array($value)) {
            return empty($value) ? null : (string) $value;
        }
        return $value !== null ? (string) $value : null;
    }

    // GET: Fetch all leads
    public function index()
    {
        // THE FIX: Added 'assignedTo' here so the frontend can see the employee's name!
        $leads = Lead::with(['business.socialMedia', 'assignedTo'])->get();
        return response()->json($leads);
    }

    // POST: Save a new lead
    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            // 1. Create the Business Record (Strictly forcing strings)
            $business = Business::create([
                'Business_Name'             => is_array($request->Business_Name) ? '' : (string)$request->Business_Name,
                'Industry'                  => is_array($request->Industry) ? '' : (string)$request->Industry,
                'Website_Link'              => is_array($request->Website_Link) ? '' : (string)$request->Website_Link,
                'Contact_Person_First_Name' => is_array($request->Contact_Person_First_Name) ? '' : (string)$request->Contact_Person_First_Name,
                'Contact_Last_Name'         => is_array($request->Contact_Last_Name) ? '' : (string)$request->Contact_Last_Name,
                'Contact_Person_Phone'      => is_array($request->Contact_Person_Phone) ? '' : (string)$request->Contact_Person_Phone,
                'Contact_Person_Email'      => is_array($request->Contact_Person_Email) ? '' : (string)$request->Contact_Person_Email,
                'Business_Owner_First_Name' => is_array($request->Business_Owner_First_Name) ? '' : (string)$request->Business_Owner_First_Name,
                'Business_Owner_Last_Name'  => is_array($request->Business_Owner_Last_Name) ? '' : (string)$request->Business_Owner_Last_Name,
                'Business_Owner_Phone'      => is_array($request->Business_Owner_Phone) ? '' : (string)$request->Business_Owner_Phone,
                'Business_Owner_Email'      => is_array($request->Business_Owner_Email) ? '' : (string)$request->Business_Owner_Email,
                'Business_Phone'            => is_array($request->Business_Phone) ? '' : (string)$request->Business_Phone,
                'Business_Email'            => is_array($request->Business_Email) ? '' : (string)$request->Business_Email,
            ]);

            // 2. BULLETPROOF ID GENERATOR (Never duplicates!)
            $leadId = is_array($request->Lead_ID) ? '' : (string)$request->Lead_ID;
            if (empty($leadId)) {
                $nextNumber = 1;
                // Loop to check if ID exists (even soft-deleted ones)
                while (\App\Models\Lead::where('Lead_ID', 'CHIMES-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT))->exists()) {
                    $nextNumber++;
                }
                $leadId = 'CHIMES-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
            }

            // Ensure Date_Added is never null
            $dateAdded = is_array($request->Date_Added) ? '' : (string)$request->Date_Added;
            if (empty($dateAdded)) {
                $dateAdded = date('Y-m-d'); 
            }

            // 3. Create the Lead Record
            $lead = Lead::create([
                'Lead_ID'         => $leadId,
                'Business_ID'     => $business->Business_ID,
                'Date_Added'      => $dateAdded,
                'Source'          => is_array($request->Source) ? '' : (string)$request->Source,
                'Tab_Category'    => is_array($request->Tab_Category) ? '' : (string)$request->Tab_Category,
                'Solution_Needed' => is_array($request->Solution_Needed) ? '' : (string)$request->Solution_Needed,
                'Remarks'         => is_array($request->Remarks) ? '' : (string)$request->Remarks,
            ]);

            // 4. Create Social Media Records
            if ($request->has('Social_Media') && is_array($request->Social_Media)) {
                foreach ($request->Social_Media as $url) {
                    if (!empty(trim((string)$url))) {
                        BusinessSocialMedia::create([
                            'Business_ID' => $business->Business_ID,
                            'URL'         => trim((string)$url),
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Lead successfully saved!', 'lead' => $lead], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to save lead: ' . $e->getMessage()], 500);
        }
    }

    // PUT: Update an existing lead
    public function update(Request $request, $id)
    {
        DB::beginTransaction();

        try {
            $lead = Lead::where('Lead_ID', $this->safeString($id))->first();
            if (!$lead) return response()->json(['message' => 'Lead not found.'], 404);

            $lead->update([
                'Source'          => $this->safeString($request->Source),
                'Tab_Category'    => $this->safeString($request->Tab_Category),
                'Solution_Needed' => $this->safeString($request->Solution_Needed),
                'Remarks'         => $this->safeString($request->Remarks),
            ]);

            if ($lead->Business_ID) {
                $business = Business::where('Business_ID', $lead->Business_ID)->first();
                if ($business) {
                    $business->update([
                        'Business_Name'             => $this->safeString($request->Business_Name),
                        'Industry'                  => $this->safeString($request->Industry),
                        'Website_Link'              => $this->safeString($request->Website_Link),
                        'Contact_Person_First_Name' => $this->safeString($request->Contact_Person_First_Name),
                        'Contact_Last_Name'         => $this->safeString($request->Contact_Last_Name),
                        'Contact_Person_Phone'      => $this->safeString($request->Contact_Person_Phone),
                        'Contact_Person_Email'      => $this->safeString($request->Contact_Person_Email),
                        'Business_Owner_First_Name' => $this->safeString($request->Business_Owner_First_Name),
                        'Business_Owner_Last_Name'  => $this->safeString($request->Business_Owner_Last_Name),
                        'Business_Owner_Phone'      => $this->safeString($request->Business_Owner_Phone),
                        'Business_Owner_Email'      => $this->safeString($request->Business_Owner_Email),
                        'Business_Phone'            => $this->safeString($request->Business_Phone),
                        'Business_Email'            => $this->safeString($request->Business_Email),
                    ]);

                    BusinessSocialMedia::where('Business_ID', $business->Business_ID)->delete();
                    if ($request->has('Social_Media') && is_array($request->Social_Media)) {
                        foreach ($request->Social_Media as $url) {
                            if (!empty(trim((string)$url))) {
                                BusinessSocialMedia::create(['Business_ID' => $business->Business_ID, 'URL' => trim((string)$url)]);
                            }
                        }
                    }
                }
            }
            DB::commit();
            return response()->json(['message' => 'Lead updated successfully!'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to update lead: ' . $e->getMessage()], 500);
        }
    }

    // DELETE: Remove a lead
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $lead = Lead::where('Lead_ID', $this->safeString($id))->first();
            if (!$lead) return response()->json(['message' => 'Lead not found.'], 404);

            if ($lead->Business_ID) {
                BusinessSocialMedia::where('Business_ID', $lead->Business_ID)->delete();
                Business::where('Business_ID', $lead->Business_ID)->delete();
            }

            $lead->delete();
            DB::commit();
            return response()->json(['message' => 'Lead deleted successfully.'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Failed to delete lead: ' . $e->getMessage()], 500);
        }
    }

    // --- Assign leads to an employee ---
    public function assignLeads(Request $request)
    {
        $request->validate(['lead_ids' => 'required|array', 'employee_id' => 'required|exists:users,id']);
        try {
            Lead::whereIn('Lead_ID', $request->lead_ids)->update(['user_id' => $request->employee_id]);
            return response()->json(['message' => 'Leads successfully assigned!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign leads: ' . $e->getMessage()], 500);
        }
    }

    // --- Fetch assigned leads ---
    public function getAssignedLeads($userId)
    {
        try {
            $leads = Lead::with(['business', 'business.socialMedia'])->where('user_id', $this->safeString($userId))->get();
            $formattedLeads = $leads->map(function ($lead) {
                $leadArray = $lead->toArray();
                $leadArray['pipeline'] = [
                    'Lead_Status'    => $lead->Lead_Status ?? 'New Lead',
                    'Inquiry_Sent'   => $lead->Inquiry_Sent === 'Yes',
                    'Replied'        => $lead->Replied === 'Yes',
                    'Email_Sent'     => $lead->Email_Sent === 'Yes',
                    'Email_Replied'  => $lead->Email_Replied === 'Yes',
                    'Date_Dialed'    => $lead->Date_Dialed,
                    'Remarks'        => $lead->Pipeline_Remarks,
                    'Meeting_Booked' => $lead->Meeting_Booked === 'Yes',
                ];
                $leadArray['inquiry'] = ['Inquiry_Type' => $lead->Inquiry_Type];
                return $leadArray;
            });
            return response()->json($formattedLeads, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch assigned leads: ' . $e->getMessage()], 500);
        }
    }

    // --- Auto-Save Pipeline Data ---
    public function updatePipeline(Request $request, $id)
    {
        try {
            $lead = Lead::where('Lead_ID', $this->safeString($id))->first();
            if (!$lead) return response()->json(['message' => 'Lead not found.'], 404);

            $field = $this->safeString($request->input('field'));
            $value = $this->safeString($request->input('value'));
            
            $allowedFields = ['Lead_Status', 'Inquiry_Sent', 'Inquiry_Type', 'Replied', 'Email_Sent', 'Email_Replied', 'Date_Dialed', 'Pipeline_Remarks', 'Meeting_Booked'];

            if (in_array($field, $allowedFields)) {
                $lead->update([$field => $value]);
            }
            return response()->json(['message' => 'Pipeline updated successfully!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update pipeline: ' . $e->getMessage()], 500);
        }
    }
}