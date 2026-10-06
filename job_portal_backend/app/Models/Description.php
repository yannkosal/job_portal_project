<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Description extends Model
{
    protected $table = 'descriptions';
    protected $fillable = [
        'job_listing_id',
        'key_role',
        'responsibility',
        'skill_and_experience'
    ];

    // Relationship
    public function jobListing(){
        return $this->belongsTo(JobListing::class);
    }
}
