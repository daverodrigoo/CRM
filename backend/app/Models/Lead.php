<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $table = 'leads';
    protected $primaryKey = 'Lead_ID';
    public $incrementing = false;
    protected $keyType = 'string';

    // We added 'user_id' to the fillable array so it can be updated!
    protected $fillable = [
        'Lead_ID', 
        'Business_ID', 
        'user_id', 
        'Date_Added', 
        'Source', 
        'Tab_Category', 
        'Solution_Needed', 
        'Remarks',
        // NEW PIPELINE COLUMNS:
        'Lead_Status',
        'Inquiry_Sent',
        'Inquiry_Type',
        'Replied',
        'Email_Sent',
        'Email_Replied',
        'Date_Dialed',
        'Pipeline_Remarks',
        'Meeting_Booked'
    ];

    public function business()
    {
        return $this->belongsTo(Business::class, 'Business_ID', 'Business_ID');
    }

    // NEW: Link the lead to the assigned employee
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}