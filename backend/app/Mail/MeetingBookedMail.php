<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MeetingBookedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $admin;
    public $assignedLead;
    public $assignerName;

    public function __construct($admin, $assignedLead, $assignerName)
    {
        $this->admin = $admin;
        $this->assignedLead = $assignedLead;
        $this->assignerName = $assignerName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $businessName = $this->assignedLead->masterLead->business->Business_Name ?? 'a New Client';
        return new Envelope(subject: 'New Meeting Booked: ' . $businessName);
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(view: 'emails.meeting_booked');
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
