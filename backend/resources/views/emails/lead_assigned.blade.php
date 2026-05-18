<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #7E3A99;">New Leads Assigned!</h2>
        <p>Hello {{ $user->first_name ?? $user->name }},</p>
        <p>You have just been assigned a new batch of leads to work on.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Batch Name:</strong> {{ $batchName }}</p>
            <p style="margin: 0;"><strong>Total Leads:</strong> {{ $leadCount }}</p>
        </div>
        <!--
        <p>Please log in to your CRM Dashboard to view and contact your new leads.</p>
        <a href="http://localhost:5173/employee/leads" style="display: inline-block; background-color: #7E3A99; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">View My Leads</a>
        -->
    </div>
</body>
</html>