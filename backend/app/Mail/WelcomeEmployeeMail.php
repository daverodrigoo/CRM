<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmployeeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $plainPassword; // Only for their very first login!

    public function __construct($user, $plainPassword)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to CHIMES CRM!',
        );
    }

    public function content(): Content
    {
        // This points to the HTML template we will build in Step 3
        return new Content(
            view: 'emails.welcome_employee',
        );
    }
}