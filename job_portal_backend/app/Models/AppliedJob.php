<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppliedJob extends Model
{
    protected $fillable = [
        'user_id',
        'job_id',
        'first_name',
        'last_name',
        'email',
        'linkedln',
        'resume',
        'status',
    ];

    // Relationship
    public function job(){
        return $this->belongsTo(JobListing::class, 'job_id');
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
