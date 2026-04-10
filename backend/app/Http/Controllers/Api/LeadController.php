<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\Lead;
use App\Models\BusinessSocialMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AssignmentBatch;
use App\Models\AssignedLead;

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

// --- Assign leads to an employee (Creates a Tab/Batch and Photocopies) ---
    public function assignLeads(Request $request)
    {
        // 1. Validate the incoming request (Now requires a batch_name!)
        $validated = $request->validate([
            'lead_ids' => 'required|array',
            'employee_id' => 'required|exists:users,id',
            'batch_name' => 'required|string|max:255', 
        ]);

        try {
            // 2. Create the new Batch (The Tab)
            $batch = AssignmentBatch::create([
                'user_id' => $validated['employee_id'],
                'Batch_Name' => $validated['batch_name'],
            ]);

            // 3. Create a Photocopy for every single lead selected
            foreach ($validated['lead_ids'] as $leadId) {
                AssignedLead::create([
                    'Batch_ID' => $batch->Batch_ID,
                    'Lead_ID' => $leadId,
                    'Date_Assigned' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Successfully assigned ' . count($validated['lead_ids']) . ' leads to ' . $batch->Batch_Name
            ], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to assign leads: ' . $e->getMessage()], 500);
        }
    }

    // --- Fetch assigned leads (Now fetches Batches and Nested Leads) ---
    public function getAssignedLeads($userId)
    {
        try {
            // 1. Fetch the Batches owned by this user, and eagerly load the photocopied leads + master blueprints
            $batches = AssignmentBatch::with([
                'assignedLeads.masterLead.business.socialMedia',
                'assignedLeads.inquiries'
            ])->where('user_id', $this->safeString($userId))->get();

            // 2. Format it cleanly so React can easily map through the Tabs and Tables
            $formattedBatches = $batches->map(function ($batch) {
                return [
                    'Batch_ID' => $batch->Batch_ID,
                    'Batch_Name' => $batch->Batch_Name,
                    'leads' => $batch->assignedLeads->map(function ($assignedLead) {
                        $master = $assignedLead->masterLead;
                        $business = $master ? $master->business : null;

                        return [
                            // Pipeline Instance Data (The Photocopy)
                            'Assigned_Lead_ID' => $assignedLead->Assigned_Lead_ID,
                            'Date_Assigned' => $assignedLead->Date_Assigned,
                            'Responded' => (bool) $assignedLead->Responded,
                            'Meeting_Booked' => (bool) $assignedLead->Meeting_Booked,
                            'Completed' => (bool) $assignedLead->Completed,
                            'Meeting_Date' => $assignedLead->Meeting_Date,
                            'Meeting_Held' => (bool) $assignedLead->Meeting_Held,
                            'Remarks' => $assignedLead->Remarks,
                            'Service_Offered' => $assignedLead->Service_Offered,
                            'Deal_Closed' => (bool) $assignedLead->Deal_Closed,
                            'Deal_Value' => $assignedLead->Deal_Value,
                            'inquiries' => $assignedLead->inquiries->pluck('Inquiry_Type'),
                            
                            // Master Lead & Business Data (For the UI table & View Modal)
                            'Lead_ID' => $assignedLead->Lead_ID,
                            'Business_Name' => $business ? $business->Business_Name : 'Unknown',
                            'Industry' => $business ? $business->Industry : 'Unknown',
                            'Business_Email' => $business ? $business->Business_Email : '',
                            'Business_Phone' => $business ? $business->Business_Phone : '',
                            'Contact_Person_First_Name' => $business ? $business->Contact_Person_First_Name : '',
                            'Contact_Last_Name' => $business ? $business->Contact_Last_Name : '',
                            
                            // Send the whole master object just in case the View Modal needs more details
                            'master_data' => $master
                        ];
                    })
                ];
            });

            return response()->json($formattedBatches, 200);

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

    // --- Update an Assigned Lead (Photocopy) Pipeline Field ---
    public function updateAssignedLeadPipeline(Request $request, $assignedLeadId)
    {
        $request->validate([
            'field' => 'required|string',
        ]);

        try {
            $assignedLead = AssignedLead::findOrFail($assignedLeadId);
            $field = $request->input('field');
            $value = $request->input('value');

            // Handle the separate inquiries table
            if ($field === 'Inquiry_Type') {
                $assignedLead->inquiries()->delete(); // clear old ones
                if ($value && $value !== 'None') {
                    $assignedLead->inquiries()->create(['Inquiry_Type' => $value]);
                }
            } else {
                // Handle standard fields (Responded, Remarks, Meeting_Booked)
                $assignedLead->$field = $value;
                $assignedLead->save();
            }

            return response()->json(['message' => "$field updated successfully"], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update field: ' . $e->getMessage()], 500);
        }
    }

    // --- Update Batch Name ---
    public function updateBatchName(Request $request, $batchId)
    {
        $request->validate([
            'Batch_Name' => 'required|string|max:255',
        ]);

        try {
            $batch = AssignmentBatch::findOrFail($batchId);
            $batch->Batch_Name = $request->input('Batch_Name');
            $batch->save();

            return response()->json(['message' => 'Batch name updated successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update batch name: ' . $e->getMessage()], 500);
        }
    }

    // --- Delete an Assignment Batch ---
    public function deleteBatch($batchId)
    {
        try {
            $batch = AssignmentBatch::findOrFail($batchId);
            $batch->delete(); // Cascades and deletes all AssignedLeads inside it automatically!

            return response()->json(['message' => 'Batch deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete batch: ' . $e->getMessage()], 500);
        }
    }

    // --- Super Admin: Get Progress Summary for All Employees ---
    public function getAllAssignedLeadsSummary()
    {
        try {
            // Fetch all batches, and eager load the user and assigned leads
            $batches = AssignmentBatch::with(['user', 'assignedLeads.masterLead.business', 'assignedLeads.inquiries'])->get();

            // Group everything by the User (Employee)
            $grouped = $batches->groupBy('user_id')->map(function ($userBatches) {
                $user = $userBatches->first()->user;
                return [
                    'User_ID' => $user->id,
                    'Name' => $user->name ?? explode('@', $user->email), // Fallback if name is null
                    'Email' => $user->email ?? '',
                    'Batches' => $userBatches->map(function ($batch) {
                        return [
                            'Batch_ID' => $batch->Batch_ID,
                            'Batch_Name' => $batch->Batch_Name,
                            'Total_Leads' => $batch->assignedLeads->count(),
                            'Completed_Leads' => $batch->assignedLeads->where('Completed', true)->count(),
                            'Leads' => $batch->assignedLeads->map(function ($lead) {
                                $business = $lead->masterLead ? $lead->masterLead->business : null;
                                return [
                                    'Assigned_Lead_ID' => $lead->Assigned_Lead_ID,
                                    'Business_Name' => $business ? $business->Business_Name : 'Unknown',
                                    'Date_Assigned' => $lead->Date_Assigned,
                                    'Completed' => (bool) $lead->Completed,
                                    'Responded' => (bool) $lead->Responded,
                                    'Meeting_Booked' => (bool) $lead->Meeting_Booked,
                                    'Inquiry_Type' => $lead->inquiries->first()->Inquiry_Type ?? 'None',
                                    'Remarks' => $lead->Remarks
                                ];
                            })->values()
                        ];
                    })->values()
                ];
            })->values();

            return response()->json($grouped, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch summary: ' . $e->getMessage()], 500);
        }
    }
    
}