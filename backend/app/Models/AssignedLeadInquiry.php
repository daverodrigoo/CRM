<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignedLeadInquiry extends Model
{
    use HasFactory;

    protected $table = 'assigned_lead_inquiries';

    protected $fillable = [
        'Assigned_Lead_ID',
        'Inquiry_Type',
    ];

    public function assignedLead()
    {
        return $this->belongsTo(AssignedLead::class, 'Assigned_Lead_ID', 'Assigned_Lead_ID');
    }
}