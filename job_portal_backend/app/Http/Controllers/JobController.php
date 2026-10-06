<?php

namespace App\Http\Controllers;

use App\Models\CompanyLogo;
use App\Models\Description;
use App\Models\JobListing;
use Illuminate\Http\Request;

class JobController extends Controller
{
    public function index()
    {
        return JobListing::with(['description', 'companyLogo'])
            ->latest('posted_date')
            ->get();
    }

    // Create Job
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'department' => 'required|string',
            'level' => 'required|string|in:intern,junior,mid,senior,lead,manager',
            'location' => 'required|string',
            'location_type' => 'required|string|in:remote,onsite,hybrid',
            'job_type' => 'required|string|in:Full-time,Part-time,Contract,Internship,Freelance',
            'application_deadline' => 'nullable|date',
            'min_salary' => 'required|numeric|min:0',
            'max_salary' => 'nullable|numeric|min:0|gte:min_salary',
            'company_name' => 'required|string',
            'website' => 'nullable|url|max:2048',
            'contact_person' => 'required|string',
            'company_email' => 'required|email',
            'company_description' => 'required|string',
            // Descriptions
            'key_role' => 'required|string',
            'responsibility' => 'required|string',
            'skill_and_experience' => 'required|string',
            // Company Logo
            'company_logo' => 'nullable|file|image|mimes:jpg,jpeg,png,webp|max:4048',
        ]);

        $jobListing = JobListing::create([
            'title' => $validated['title'],
            'department' => $validated['department'],
            'level' => $validated['level'],
            'location' => $validated['location'] ?? null,
            'location_type' => $validated['location_type'],
            'job_type' => $validated['job_type'],
            'application_deadline' => $validated['application_deadline'] ?? null,
            'min_salary' => $validated['min_salary'],
            'max_salary' => $validated['max_salary'] ?? null,
            'company_name' => $validated['company_name'],
            'website' => $validated['website'] ?? null,
            'contract_person' => $validated['contact_person'],
            'company_email' => $validated['company_email'],
            'company_description' => $validated['company_description'],
            'posted_date' => now(),
            // 'user_id'=>auth('api')->id(),
            'user_id' => 2,
        ]);

        // Handle logo if exist
        $description = Description::create([
            'job_listing_id' => $jobListing->id,
            'key_role' => $validated['key_role'],
            'responsibility' => $validated['responsibility'],
            'skill_and_experience' => $validated['skill_and_experience']
        ]);

        $logo = null;
        if ($request->hasFile('company_logo')) {
            $file = $request->file('company_logo');
            $originalName = $file->getClientOriginalName();
            $path = $file->store('company_logos', 'public');

            $logo = CompanyLogo::create([
                'original_name' => $originalName,
                'logo_path' => $path,
                'job_listing_id' => $jobListing->id
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Job listing created successfully!',
            'data' => [
                'job_listing_id' => $jobListing,
                'description' => $description,
                'company_logo' => $logo
            ]
        ], 201);
    }
}
