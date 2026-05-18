<!DOCTYPE html>
<html>
<head>
    <title>Welcome to CHIMES CRM</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
    <div style="max-w-md; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #7E3A99;">Welcome to the Team, {{ $user->first_name ?? $user->name }}!</h2>
        
        <p>An administrator has created a CHIMES CRM account for you.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Login Email:</strong> {{ $user->Email ?? $user->email }}</p>
            <p style="margin: 0;"><strong>Temporary Password:</strong> {{ $plainPassword }}</p>
        </div>

        <!--
        <p>Please log in and change your password as soon as possible.</p>

        <a href="http://localhost:5173/login" style="display: inline-block; background-color: #7E3A99; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In to CRM</a>
        -->
    </div>
</body>
</html>