<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    protected $table = 'job_listings';
    protected $fillable = [
        'user_id',
        'title',
        'location',
        'location_type',
        'min_salary',
        'max_salary',
        'posted_date',
        'job_type',
        'level',
        'application_deadline',
        'company_name',
        'company_description',
        'contract_person',
        'company_email',
        'department',
        'website',
    ];

    protected $casts = [
        'posted_date' => 'datetime',
        'application_deadline' => 'datetime'
    ];
    
    // Relationship
    public function user(){
        return $this->belongsTo(User::class);
    }

    public function description(){
        return $this->hasOne(Description::class);
    }

    public function companyLogo(){
        return $this->hasOne(CompanyLogo::class, 'job_listing_id');
    }

    public function appliedJob(){
        return $this->hasOne(AppliedJob::class, 'job_id');
    }
}
