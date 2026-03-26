<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentBatch extends Model
{
    use HasFactory;

    protected $table = 'assignment_batches';
    protected $primaryKey = 'Batch_ID';

    protected $fillable = [
        'user_id',
        'Batch_Name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function assignedLeads()
    {
        return $this->hasMany(AssignedLead::class, 'Batch_ID', 'Batch_ID');
    }
}