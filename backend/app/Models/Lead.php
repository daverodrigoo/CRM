<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $primaryKey = 'Lead_ID';
    public $incrementing = false; // Tells Laravel this is NOT an auto-incrementing integer
    protected $keyType = 'string'; // Tells Laravel this is a string

    protected $fillable = [
        'Lead_ID', 'Business_ID', 'Date_Added', 'Source', 'Tab_Category', 'Solution_Needed', 'Remarks'
    ];

    public function business()
    {
        return $this->belongsTo(Business::class, 'Business_ID', 'Business_ID');
    }
}