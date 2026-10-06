import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import JobDetail from "./pages/JobDetail";
import Dashboard from "./pages/Dashboard";
import CreateJob from "./pages/CreateJob";
import ManageJobs from "./pages/ManageJobs";
import EditJob from "./pages/EditJob";
import EditProfile from "./pages/EditProfile";
import SavedJob from "./pages/SavedJob";
import RecruiterLogin from "./pages/auth/RecruiterLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import RecruiterSignup from "./pages/auth/RecruiterSignup";
import UserLogin from "./pages/auth/UserLogin";
import UserSignup from "./pages/auth/UserSignup";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ToastProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobDetails" element={<JobDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createJob" element={<CreateJob />} />
            <Route path="/manageJobs" element={<ManageJobs />} />
            <Route path="/editJob" element={<EditJob />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/savedJobs" element={<SavedJob />} />
            {/* Recruiter Login and Signup */}
            <Route path="/recruiterLogin" element={<RecruiterLogin />} />
            <Route path="/recruiterSignup" element={<RecruiterSignup />} />
            {/* User Login and Signup */}
            <Route path="/userLogin" element={<UserLogin />} />
            <Route path="/userSignup" element={<UserSignup />} />
          </Routes>
        </ToastProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
