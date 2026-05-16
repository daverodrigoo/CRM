<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #7E3A99;">New Meeting Scheduled!</h2>
        <p>Hello {{ $admin->first_name ?? $admin->name }},</p>
        <p><strong>{{ $assignerName }}</strong> has just booked a new meeting and assigned it to your calendar.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Business:</strong> {{ $assignedLead->masterLead->business->Business_Name ?? 'Unknown' }}</p>
            <p style="margin: 0;"><strong>Date:</strong> {{ \Carbon\Carbon::parse($assignedLead->Meeting_Date)->format('F j, Y') }}</p>
            <p style="margin: 0;"><strong>Time:</strong> {{ $assignedLead->Meeting_Time }}</p>
            <p style="margin: 0;"><strong>Type:</strong> {{ $assignedLead->Meeting_Type }}</p>
            <p style="margin: 0;"><strong>Service Offered:</strong> {{ $assignedLead->Service_Offered }}</p>
        </div>
        @if(!empty($assignedLead->Meeting_Notes))
            <p><strong>Notes:</strong> {{ $assignedLead->Meeting_Notes }}</p>
        @endif
        <a href="http://localhost:5173/meeting" style="display: inline-block; background-color: #7E3A99; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Meeting Details</a>
    </div>
</body>
</html>