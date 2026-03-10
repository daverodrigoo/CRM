<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    use HasFactory;

    protected $primaryKey = 'Business_ID';

    protected $fillable = [
        'Business_Name', 'Industry', 'Website_Link', 
        'Contact_Person_First_Name', 'Contact_Last_Name', 'Contact_Person_Phone', 'Contact_Person_Email',
        'Business_Owner_First_Name', 'Business_Owner_Last_Name', 'Business_Owner_Phone', 'Business_Owner_Email',
        'Business_Phone', 'Business_Email'
    ];

    public function leads()
    {
        return $this->hasMany(Lead::class, 'Business_ID', 'Business_ID');
    }

    public function socialMedia()
    {
        return $this->hasMany(BusinessSocialMedia::class, 'Business_ID', 'Business_ID');
    }
}