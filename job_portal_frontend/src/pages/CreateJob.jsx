import Aside from "../components/Aside";
import { useState } from "react";
import SelectInput from "../components/inputs/SelectInput";
import TextInput from "../components/inputs/TextInput";
import TextAreaInput from "../components/inputs/TextAreaInput";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../api/axios";

function CreateJob() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((pre) => !pre);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    level: "",
    key_role: "",
    responsibility: "",
    skill_and_experience: "",
    location: "",
    location_type: "",
    job_type: "",
    application_deadline: "",
    min_salary: "",
    max_salary: "",
    company_description: "",
    company_name: "",
    website: "",
    contact_person: "",
    company_email: "",
    company_logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "company_logo") {
      setFormData({ ...formData, company_logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value.trimStart() });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError("");

    // Skill null values
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      // Only skill null file fields, send everything else including ""
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    });

    try {
      await api.post("/jobs", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setFormData({
        title: "",
        department: "",
        level: "",
        key_role: "",
        responsibility: "",
        skill_and_experience: "",
        location: "",
        location_type: "",
        job_type: "",
        application_deadline: "",
        min_salary: "",
        max_salary: "",
        company_description: "",
        company_name: "",
        website: "",
        contact_person: "",
        company_email: "",
        company_logo: null,
      });
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      setSubmitError(
        validationErrors
          ? Object.values(validationErrors).flat().join(" ")
          : error.response?.data?.message || "Could not create the job listing.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* header for mobile */}
      <header className="h-16 flex items-center bg-white shadow-md border-b lg:hidden">
        <button onClick={toggleSidebar} className="p-4 text-purple-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
        <div className="ml-4 text-xl font-semibold text-purple-800">
          Talent Hub
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
            onClick={toggleSidebar}
          ></div>
        )}
        <Aside isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
          <header className="mb-6 sm:mb-8 pb-4 border-b border-gray-300">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Create New Job
            </h1>
          </header>

          <section className="content-section">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-4 sm:p-8 rounded-xl shadow-lg space-y-8"
            >
              <h3 className="text-lg font-semibold text-purple-700 border-b pb-2 mb-4 border-gray-300">
                Job Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextInput
                  label="Job Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  required={true}
                />
                <SelectInput
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required={true}
                  options={[
                    { value: "Administration", label: "Administration" },
                    { value: "Customer Service", label: "Customer Service" },
                    { value: "Design", label: "Design" },
                    { value: "Engineering", label: "Engineering" },
                    { value: "Finance", label: "Finance" },
                    { value: "Human Resources", label: "Human Resources" },
                    {
                      value: "Information Technology",
                      label: "Information Technology",
                    },
                    { value: "Legal", label: "Legal" },
                    { value: "Marketing", label: "Marketing" },
                    { value: "Operations", label: "Operations" },
                    { value: "Product", label: "Product" },
                    {
                      value: "Research & Development",
                      label: "Research & Development",
                    },
                    { value: "Sales", label: "Sales" },
                  ]}
                />
                <SelectInput
                  label="Job Level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required={true}
                  options={[
                    { value: "intern", label: "Intern" },
                    { value: "junior", label: "Junior" },
                    { value: "mid", label: "Mid" },
                    { value: "senior", label: "Senior" },
                    { value: "lead", label: "Lead" },
                    { value: "manager", label: "Manager" },
                  ]}
                />
              </div>

              <h3 className="text-lg font-semibold text-purple-700 border-b pb-2 mb-4 border-gray-300">
                Job Description Details
              </h3>
              <div className="space-y-6">
                <TextAreaInput
                  label="Key Role / Summary"
                  name="key_role"
                  value={formData.key_role}
                  onChange={handleChange}
                  placeholder="A brief summary of the position and its impact."
                  rows={3}
                  required={true}
                />

                <TextAreaInput
                  label="Responsibilities"
                  name="responsibility"
                  value={formData.responsibility}
                  onChange={handleChange}
                  placeholder="List the primary day-to-day duties and deliverables (e.g., Develop new features, Collaborate with design team, etc.)"
                  rows={6}
                  required={true}
                />

                <TextAreaInput
                  label="Skills & Experience"
                  name="skill_and_experience"
                  value={formData.skill_and_experience}
                  onChange={handleChange}
                  placeholder="List required qualifications, technical skills, and years of experience (e.g., 5+ years with React, Proficient in Tailwind CSS, Bachelor's degree, etc.)"
                  rows={6}
                  required={true}
                />
              </div>

              <h3 className="text-lg font-semibold text-purple-700 border-b pb-2 mb-4 border-gray-300">
                Location, Salary & Schedule
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <TextInput
                  label="Location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  name="location"
                  placeholder="City, State, or Country"
                  required={true}
                />

                <SelectInput
                  label="Work Setup"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  required={true}
                  options={[
                    { value: "onsite", label: "On-site" },
                    { value: "remote", label: "Remote" },
                    { value: "hybrid", label: "Hybrid" },
                  ]}
                />

                <SelectInput
                  label="Job Type "
                  name="job_type"
                  value={formData.job_type}
                  onChange={handleChange}
                  required={true}
                  options={[
                    { value: "Full-time", label: "Full-time" },
                    { value: "Part-time", label: "Part-time" },
                    { value: "Contract", label: "Contract" },
                    { value: "Internship", label: "Internship" },
                    { value: "Freelance", label: "Freelance" },
                  ]}
                />

                <TextInput
                  label="Application Deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  name="application_deadline"
                  required={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Minimum Salary"
                  type="number"
                  value={formData.min_salary}
                  onChange={handleChange}
                  name="min_salary"
                  placeholder="70000"
                  min="0"
                  required={true}
                />

                <TextInput
                  label="Maximum Salary"
                  type="number"
                  value={formData.max_salary}
                  onChange={handleChange}
                  name="max_salary"
                  placeholder="95000"
                  min="0"
                />
              </div>

              <h3 className="text-lg font-semibold text-purple-700 border-b pb-2 mb-4 border-gray-300">
                Company & Contact Info
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <TextAreaInput
                  label="Company Description"
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleChange}
                  placeholder="Briefly describe your company, its mission, and culture."
                  rows={4}
                  required={true}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  label="Company Name "
                  type="text"
                  value={formData.company_name}
                  onChange={handleChange}
                  name="company_name"
                  placeholder="e.g., Microsoft, Google, etc."
                  required={true}
                />

                <TextInput
                  label="Company Website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  name="website"
                  placeholder="https://www.company.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TextInput
                  label="Contact Person (Hiring Manager) "
                  type="text"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="Name or HR Contact"
                  required={true}
                />
                <TextInput
                  label="Company Email"
                  type="email"
                  value={formData.company_email}
                  onChange={handleChange}
                  name="company_email"
                  placeholder="hr@company.com"
                  required={true}
                />

                <TextInput
                  label="Company Logo"
                  type="file"
                  onChange={handleChange}
                  name="company_logo"
                  accept="image/*"
                />
              </div>

              {submitError && (
                <p className="text-red-600" role="alert">
                  {submitError}
                </p>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 sm:px-8 sm:py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-150 shadow-lg focus:outline-none flex items-center justify-center space-x-2"
                >
                  <>
                    <FaCloudUploadAlt className="w-5 h-5" />
                    <span>{loading ? "Posting..." : "Post Job Now"}</span>
                  </>
                </button>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CreateJob;
