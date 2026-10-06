import AppliedJobListings from "../components/AppliedJobListings";
import UserProfile from "../components/UserProfile";

function SavedJob() {
  return (
    <div className="w-[95%] mx-auto py-10 flex flex-col lg:flex-row gap-8">
      <UserProfile />
      <AppliedJobListings />
    </div>
  );
}

export default SavedJob;
