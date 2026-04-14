<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignedLead extends Model
{
    use HasFactory;

    protected $table = 'assigned_leads';
    protected $primaryKey = 'Assigned_Lead_ID';

    protected $fillable = [
        'Batch_ID',
        'Lead_ID',
        'Date_Assigned',
        'Responded',
        'Point_of_Contact',
        'Meeting_Booked',
        'Completed',
        'Meeting_Date',
        'Meeting_Held',
        'Service_Offered',
        'Remarks',
        'Deal_Closed',
        'Deal_Value',
    ];

    public function batch()
    {
        return $this->belongsTo(AssignmentBatch::class, 'Batch_ID', 'Batch_ID');
    }

    public function masterLead()
    {
        return $this->belongsTo(Lead::class, 'Lead_ID', 'Lead_ID');
    }

    public function inquiries()
    {
        return $this->hasMany(AssignedLeadInquiry::class, 'Assigned_Lead_ID', 'Assigned_Lead_ID');
    }
}