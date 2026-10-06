<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyLogo extends Model
{
    protected $fillable = [
        'job_listing_id',
        'original_name',
        'logo_path'
    ];

    // Relationship
    public function jobListing(){
        return $this->belongsTo(JobListing::class);
    }
}
