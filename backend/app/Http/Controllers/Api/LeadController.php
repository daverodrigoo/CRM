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
use Illuminate\Support\Facades\Mail;
use App\Mail\LeadAssignedMail;
use App\Mail\MeetingBookedMail;
use App\Models\User;

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
        // 1. Laravel Best Practice Validation (Protects the database)
        $validated = $request->validate([
            'Business_Name'             => 'required|string|max:255',
            'Industry'                  => 'required|string|max:255',
            'Acquisition_Date'          => 'required|date',
            
            // Emails
            'Business_Email'            => 'nullable|email|max:255',
            'Business_Owner_Email'      => 'nullable|email|max:255',
            'Contact_Person_Email'      => 'nullable|email|max:255',
            
            // Phones
            'Business_Phone'            => 'nullable|string|max:50',
            'Business_Owner_Phone'      => 'nullable|string|max:50',
            'Contact_Person_Phone'      => 'nullable|string|max:50',

            // Strings
            'Website_Link'              => 'nullable|string|max:255',
            'Business_Owner_First_Name' => 'nullable|string|max:255',
            'Business_Owner_Last_Name'  => 'nullable|string|max:255',
            'Contact_Person_First_Name' => 'nullable|string|max:255',
            'Contact_Last_Name'         => 'nullable|string|max:255',
            'Source'                    => 'nullable|string|max:255',
            'Tab_Category'              => 'nullable|string|max:255',
            'Solution_Needed'           => 'nullable|string',
            'Remarks'                   => 'nullable|string',
            
            // Arrays & System fields
            'Date_Added'                => 'nullable|date',
            'Lead_ID'                   => 'nullable|string',
            'Social_Media'              => 'nullable|array',
            'Social_Media.*'            => 'nullable|string' 
        ]);

        // 2. Custom Backend Validation: Cascading Contact Rule
        $hasBusiness = !empty($request->Business_Phone) || !empty($request->Business_Email);
        $hasOwner    = !empty($request->Business_Owner_Phone) || !empty($request->Business_Owner_Email);
        $hasPerson   = !empty($request->Contact_Person_Phone) || !empty($request->Contact_Person_Email);

        if (!$hasBusiness && !$hasOwner && !$hasPerson) {
            return response()->json([
                'errors' => ['contact' => ['You must provide at least a Phone or an Email for the Business, Owner, or Contact Person.']]
            ], 422);
        }

        // 3. Custom Backend Validation: Duplicate Check (Business Name ONLY)
        $isDuplicate = \App\Models\Business::whereRaw('LOWER(Business_Name) = ?', [strtolower(trim($request->Business_Name))])
            ->exists();

        if ($isDuplicate) {
            return response()->json([
                'errors' => ['duplicate' => ['A lead with this Business Name already exists in the database.']]
            ], 422);
        }

        // 4. Begin Safe Database Entry
        DB::beginTransaction();

        try {
            // Create the Business Record (Data is already validated and safe)
            $business = Business::create([
                'Business_Name'             => $request->Business_Name,
                'Industry'                  => $request->Industry,
                'Website_Link'              => $request->Website_Link ?? '',
                'Contact_Person_First_Name' => $request->Contact_Person_First_Name ?? '',
                'Contact_Last_Name'         => $request->Contact_Last_Name ?? '',
                'Contact_Person_Phone'      => $request->Contact_Person_Phone ?? '',
                'Contact_Person_Email'      => $request->Contact_Person_Email ?? '',
                'Business_Owner_First_Name' => $request->Business_Owner_First_Name ?? '',
                'Business_Owner_Last_Name'  => $request->Business_Owner_Last_Name ?? '',
                'Business_Owner_Phone'      => $request->Business_Owner_Phone ?? '',
                'Business_Owner_Email'      => $request->Business_Owner_Email ?? '',
                'Business_Phone'            => $request->Business_Phone ?? '',
                'Business_Email'            => $request->Business_Email ?? '',
            ]);

            // BULLETPROOF ID GENERATOR (Never duplicates!)
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

            // Create the Lead Record
            $lead = Lead::create([
                'Lead_ID'         => $leadId,
                'Business_ID'     => $business->Business_ID,
                'Date_Added'      => $dateAdded,
                'Acquisition_Date'=> is_array($request->Acquisition_Date) ? null : $request->Acquisition_Date,
                'Source'          => $request->Source ?? '',
                'Tab_Category'    => $request->Tab_Category ?? '',
                'Solution_Needed' => $request->Solution_Needed ?? '',
                'Remarks'         => $request->Remarks ?? '',
            ]);

            // Create Social Media Records
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
                'Acquisition_Date' => $this->safeString($request->Acquisition_Date),
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
                    'Responded' => null,      // Explicitly set to null
                    'Meeting_Booked' => null, // Explicitly set to null
                ]);
            }

            // --- NEW: Trigger Email Notification ---
            $employee = User::find($validated['employee_id']);
            if ($employee) {
                try {
                    $emailAddress = $employee->Email ?? $employee->email;
                    Mail::to($emailAddress)->send(new LeadAssignedMail($employee, $batch->Batch_Name, count($validated['lead_ids'])));
                } catch (\Exception $e) {
                    \Log::error('Lead Assignment Mail failed: ' . $e->getMessage());
                }
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
                            'Responded' => is_null($assignedLead->Responded) ? null : (bool) $assignedLead->Responded,
                            'Point_of_Contact' => $assignedLead->Point_of_Contact,
                            'Meeting_Booked' => is_null($assignedLead->Meeting_Booked) ? null : (bool) $assignedLead->Meeting_Booked,
                            'Completed' => (bool) $assignedLead->Completed,
                            'Meeting_Date' => $assignedLead->Meeting_Date,
                            'Meeting_Time' => $assignedLead->Meeting_Time,
                            'Meeting_Type' => $assignedLead->Meeting_Type,               
                            'Meeting_Assigned_to' => $assignedLead->Meeting_Assigned_to, 
                            'Meeting_Notes' => $assignedLead->Meeting_Notes,             
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
                                    'Responded' => is_null($lead->Responded) ? null : (bool) $lead->Responded,
                                    'Meeting_Booked' => is_null($lead->Meeting_Booked) ? null : (bool) $lead->Meeting_Booked,
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

    // --- Get Lead History (Only Completed, Responded, and Contacted) ---
    public function getLeadHistory($leadId)
    {
        try {
            $history = AssignedLead::with(['batch.user', 'inquiries'])
                ->where('Lead_ID', $this->safeString($leadId))
                ->where('Completed', true)
                ->whereNotNull('Responded')
                ->whereNotNull('Meeting_Booked')
                ->whereNotNull('Point_of_Contact')
                ->where('Point_of_Contact', '!=', '')
                ->where('Point_of_Contact', '!=', 'None')
                ->whereHas('inquiries', function($query) {
                    $query->whereNotNull('Inquiry_Type')
                          ->where('Inquiry_Type', '!=', 'None')
                          ->where('Inquiry_Type', '!=', '');
                })
                ->orderBy('updated_at', 'desc')
                ->get();

            $formattedHistory = $history->map(function ($assignedLead) {
                return [
                    'Batch_Name' => $assignedLead->batch ? $assignedLead->batch->Batch_Name : 'Unknown',
                    'Assigned_To' => ($assignedLead->batch && $assignedLead->batch->user) ? $assignedLead->batch->user->name : 'Unknown',
                    'Inquiry_Type' => $assignedLead->inquiries->first() ? $assignedLead->inquiries->first()->Inquiry_Type : 'None',
                    'Responded' => $assignedLead->Responded ? 'Yes' : 'No',
                    'Meeting_Booked' => $assignedLead->Meeting_Booked ? 'Yes' : 'No',
                    'Point_of_Contact' => $assignedLead->Point_of_Contact ? $assignedLead->Point_of_Contact : 'N/A',
                    'Date_Completed' => $assignedLead->updated_at->format('M d, Y'),
                ];
            });

            return response()->json($formattedHistory, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch lead history: ' . $e->getMessage()], 500);
        }
    }

    // --- Book a Meeting & Transfer to Admin ---
    public function bookMeeting(Request $request, $assignedLeadId)
    {
        $request->validate([
            'Meeting_Date' => 'required|date',
            'Meeting_Time' => 'required|string',
            'Meeting_Type' => 'required|string',
            'Meeting_Assigned_to' => 'required|exists:users,id',
            'Service_Offered' => 'required|string',
            'Meeting_Notes' => 'nullable|string',
            'Assigned_By' => 'required|exists:users,id'
        ]);

        try {
            $assignedLead = AssignedLead::findOrFail($assignedLeadId);
            
            $assignedLead->update([
                'Meeting_Date' => $request->Meeting_Date,
                'Meeting_Time' => $request->Meeting_Time,
                'Meeting_Type' => $request->Meeting_Type,
                'Meeting_Assigned_to' => $request->Meeting_Assigned_to,
                'Service_Offered' => $request->Service_Offered,
                'Meeting_Notes' => $request->Meeting_Notes,
                'Assigned_By' => $request->Assigned_By
                //'Meeting_Booked' => true, // Auto-mark as booked
            ]);

            // --- NEW: Trigger Email Notification ---
            $admin = User::find($request->Meeting_Assigned_to);
            $assigner = User::find($request->Assigned_By);
            
            if ($admin) {
                try {
                    // Load the nested business data so the email can read the Business Name
                    $assignedLead->load('masterLead.business'); 
                    
                    $assignerName = $assigner ? trim(($assigner->first_name ?? '') . ' ' . ($assigner->last_name ?? '')) ?: $assigner->name : 'An Employee';
                    $emailAddress = $admin->Email ?? $admin->email;

                    Mail::to($emailAddress)->send(new MeetingBookedMail($admin, $assignedLead, $assignerName));
                } catch (\Exception $e) {
                    \Log::error('Meeting Booked Mail failed: ' . $e->getMessage());
                }
            }

            return response()->json(['message' => 'Meeting successfully booked and transferred to Admin!'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to book meeting: ' . $e->getMessage()], 500);
        }
    }

    // --- Fetch Meetings for a Specific Admin ---
    public function getAdminMeetings($userId)
    {
        try {
            // FIX: Use 'masterLead.business' to match your AssignedLead.php model
            $meetings = AssignedLead::with('masterLead.business')
                ->where('Meeting_Assigned_to', $userId)
                ->whereNotNull('Meeting_Date')
                ->orderBy('Meeting_Date', 'asc')
                ->orderBy('Meeting_Time', 'asc')
                ->get()
                ->map(function ($assignedLead) {
                    $item = $assignedLead->toArray();
                    // Pull the business name out and attach it directly so the frontend can read it perfectly
                    $item['Business_Name'] = $assignedLead->masterLead->business->Business_Name ?? 'Unknown Business';
                    if (!empty($assignedLead->Assigned_By)) {
                    $assigner = \App\Models\User::find($assignedLead->Assigned_By);
                    if ($assigner) {
                        $fullName = trim(($assigner->first_name ?? '') . ' ' . ($assigner->last_name ?? ''));
                        // THE FIX: Fallback to the standard 'name' column if first/last are empty!
                        $item['Assigned_By_Name'] = $fullName ?: ($assigner->name ?? 'User ' . $assignedLead->Assigned_By);
                    } else {
                        $item['Assigned_By_Name'] = 'Unknown User';
                    }
                    } else {
                        $item['Assigned_By_Name'] = '-';
                    }
                    return $item;
                });

            return response()->json($meetings, 200);
        } catch (\Exception $e) {
            // Logging the error so if it fails again, you can check storage/logs/laravel.log for the exact issue
            \Log::error("Meeting Fetch Error: " . $e->getMessage()); 
            return response()->json(['error' => 'Failed to fetch meetings: ' . $e->getMessage()], 500);
        }
    }

    // --- Fetch Meetings Booked BY a Specific Employee ---
    public function getEmployeeBookedMeetings($employeeId)
    {
        try {
            // THE FIX: We now know with 100% certainty the column is 'user_id'
            $batchIds = \App\Models\AssignmentBatch::where('user_id', $employeeId)->pluck('Batch_ID')->toArray();

            if (empty($batchIds)) {
                return response()->json([], 200); // Return empty array safely if no batches found
            }

            // 2. Fetch leads tied to those batches where a meeting was successfully booked
            $meetings = \App\Models\AssignedLead::with('masterLead.business')
                ->whereIn('Batch_ID', $batchIds) 
                ->whereNotNull('Meeting_Date')
                ->orderBy('Meeting_Date', 'desc')
                ->get()
                ->map(function ($assignedLead) {
                    $item = $assignedLead->toArray();
                    $item['Business_Name'] = $assignedLead->masterLead->business->Business_Name ?? 'Unknown Business';
                    $item['business'] = $assignedLead->masterLead->business ?? null;
                    

                    if (!empty($assignedLead->Meeting_Assigned_to)) {
                        $user = \App\Models\User::find($assignedLead->Meeting_Assigned_to);
                        if ($user) {
                            // Safely checks if your DB uses first_name/last_name, or just 'name'
                            $fullName = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
                            $item['Meeting_Assigned_to'] = $fullName ?: ($user->name ?? 'Admin ' . $assignedLead->Meeting_Assigned_to);
                        }
                    }

                    // Live Status Logic (Now that the DB columns exist!)
                    $dc = $assignedLead->Deal_Closed;
                    
                    if ($dc === 'Yes' || $dc === 'yes' || $dc === 1 || $dc === '1' || $dc === true) {
                        $item['Live_Status'] = 'Deal Closed';
                    } elseif ($dc === 'No' || $dc === 'no' || $dc === 0 || $dc === '0' || $dc === false) {
                        $item['Live_Status'] = 'Deal Lost';
                    }
                    if (!empty($assignedLead->Assigned_By)) {
                    $assigner = \App\Models\User::find($assignedLead->Assigned_By);
                    if ($assigner) {
                        $fullName = trim(($assigner->first_name ?? '') . ' ' . ($assigner->last_name ?? ''));
                        // THE FIX: Fallback to the standard 'name' column if first/last are empty!
                        $item['Assigned_By_Name'] = $fullName ?: ($assigner->name ?? 'User ' . $assignedLead->Assigned_By);
                    } else {
                        $item['Assigned_By_Name'] = 'Unknown User';
                    }
                    } else {
                        $item['Assigned_By_Name'] = '-';
                    }
                    return $item;
                });

            return response()->json($meetings, 200);
        } catch (\Exception $e) {
            \Log::error("Booked Meeting Fetch Error: " . $e->getMessage()); 
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // --- Update Live Meeting Status (Admin Notes, Completed, Deal Closed) ---
    public function updateMeetingStatus(\Illuminate\Http\Request $request, $id)
    {
        try {
            $assignedLead = \App\Models\AssignedLead::findOrFail($id);
            
            // Replaced 'Completed' with our new 'Meeting_Completed'
            $assignedLead->update($request->only([
                'Admin_Notes', 
                'Meeting_Completed', 
                'Deal_Closed'
            ]));

            return response()->json(['message' => 'Status updated successfully'], 200);
        } catch (\Exception $e) {
            \Log::error("Failed to update meeting status: " . $e->getMessage());
            return response()->json(['error' => 'Failed to save: ' . $e->getMessage()], 500);
        }
    }

    // --- Fetch ALL Booked Meetings (For Super Admin) ---
    public function getAllBookedMeetings()
    {
        try {
            // Fetch ALL leads where a meeting was successfully booked (No user/batch filters)
            $meetings = \App\Models\AssignedLead::with('masterLead.business')
                ->whereNotNull('Meeting_Date')
                ->orderBy('Meeting_Date', 'desc')
                ->get()
                ->map(function ($assignedLead) {
                    $item = $assignedLead->toArray();
                    $item['Business_Name'] = $assignedLead->masterLead->business->Business_Name ?? 'Unknown Business';
                    $item['business'] = $assignedLead->masterLead->business ?? null;
                    
                    // Convert Admin ID to Real Name
                    if (!empty($assignedLead->Meeting_Assigned_to)) {
                        $user = \App\Models\User::find($assignedLead->Meeting_Assigned_to);
                        if ($user) {
                            $fullName = trim(($user->first_name ?? '') . ' ' . ($user->last_name ?? ''));
                            $item['Meeting_Assigned_to'] = $fullName ?: ($user->name ?? 'Admin ' . $assignedLead->Meeting_Assigned_to);
                        }
                    }
                    
                    // Live Status Logic
                    $dc = $assignedLead->Deal_Closed;
                    
                    if ($dc === 'Yes' || $dc === 'yes' || $dc === 1 || $dc === '1' || $dc === true) {
                        $item['Live_Status'] = 'Deal Closed';
                    } elseif ($dc === 'No' || $dc === 'no' || $dc === 0 || $dc === '0' || $dc === false) {
                        $item['Live_Status'] = 'Deal Lost';
                    }
                    if (!empty($assignedLead->Assigned_By)) {
                    $assigner = \App\Models\User::find($assignedLead->Assigned_By);
                    if ($assigner) {
                        $fullName = trim(($assigner->first_name ?? '') . ' ' . ($assigner->last_name ?? ''));
                        // THE FIX: Fallback to the standard 'name' column if first/last are empty!
                        $item['Assigned_By_Name'] = $fullName ?: ($assigner->name ?? 'User ' . $assignedLead->Assigned_By);
                    } else {
                        $item['Assigned_By_Name'] = 'Unknown User';
                    }
                    } else {
                        $item['Assigned_By_Name'] = '-';
                    }
                    return $item;
                });

            return response()->json($meetings, 200);
        } catch (\Exception $e) {
            \Log::error("All Booked Meetings Fetch Error: " . $e->getMessage()); 
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    
}