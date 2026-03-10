<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BusinessSocialMedia extends Model
{
    use HasFactory;

    protected $primaryKey = 'Social_Media_ID';
    
    // Explicitly define the table name since it's a bit long
    protected $table = 'business_social_media'; 

    protected $fillable = [
        'Business_ID', 'URL'
    ];

    public function business()
    {
        return $this->belongsTo(Business::class, 'Business_ID', 'Business_ID');
    }
}