import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider, useRole } from "@/context/RoleContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CoordinatorDashboard from "./pages/coordinator/CoordinatorDashboard";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";

import Auth from "./pages/Auth.tsx";
import Profile from "./pages/student/Profile";
import JobDrives from "./pages/student/JobDrives";
import Applications from "./pages/student/Applications";
import Interviews from "./pages/student/Interviews";
import Notifications from "./pages/student/Notifications";
import Settings from "./pages/Settings";
import AdminDrives from "./pages/admin/AdminDrives";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminProfile from "./pages/admin/AdminProfile";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterCandidates from "./pages/recruiter/RecruiterCandidates";
import RecruiterPipeline from "./pages/recruiter/RecruiterPipeline";
import RecruiterInterviews from "./pages/recruiter/RecruiterInterviews";
import CoordinatorProfile from "./pages/coordinator/CoordinatorProfile";
import CoordinatorVerification from "./pages/coordinator/CoordinatorVerification";
import CoordinatorApplications from "./pages/coordinator/CoordinatorApplications";
import CoordinatorMessages from "./pages/coordinator/CoordinatorMessages";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useRole();
  if (!token) return <Auth />;
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner theme="dark" position="top-right" />
      <BrowserRouter>
        <RoleProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/student/drives" element={<ProtectedRoute><JobDrives /></ProtectedRoute>} />
            <Route path="/student/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
            <Route path="/student/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/student/interviews" element={<ProtectedRoute><Interviews /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/drives" element={<ProtectedRoute><AdminDrives /></ProtectedRoute>} />
            <Route path="/admin/students" element={<ProtectedRoute><AdminStudents /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
            <Route path="/admin/companies" element={<ProtectedRoute><AdminCompanies /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><AdminProfile /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/coordinator" element={<ProtectedRoute><CoordinatorDashboard /></ProtectedRoute>} />
            <Route path="/coordinator/profile" element={<ProtectedRoute><CoordinatorProfile /></ProtectedRoute>} />
            <Route path="/coordinator/verify" element={<ProtectedRoute><CoordinatorVerification /></ProtectedRoute>} />
            <Route path="/coordinator/applications" element={<ProtectedRoute><CoordinatorApplications /></ProtectedRoute>} />
            <Route path="/coordinator/messages" element={<ProtectedRoute><CoordinatorMessages /></ProtectedRoute>} />
            <Route path="/coordinator/*" element={<ProtectedRoute><CoordinatorDashboard /></ProtectedRoute>} />
            <Route path="/recruiter" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="/recruiter/profile" element={<ProtectedRoute><RecruiterProfile /></ProtectedRoute>} />
            <Route path="/recruiter/candidates" element={<ProtectedRoute><RecruiterCandidates /></ProtectedRoute>} />
            <Route path="/recruiter/pipeline" element={<ProtectedRoute><RecruiterPipeline /></ProtectedRoute>} />
            <Route path="/recruiter/interviews" element={<ProtectedRoute><RecruiterInterviews /></ProtectedRoute>} />
            <Route path="/recruiter/*" element={<ProtectedRoute><RecruiterDashboard /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </RoleProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
