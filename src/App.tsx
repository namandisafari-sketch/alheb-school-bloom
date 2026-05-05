import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Staff from "./pages/Staff";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import UserManagement from "./pages/UserManagement";
import MarksEntry from "./pages/MarksEntry";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import SiteSettings from "./pages/SiteSettings";
import Salary from "./pages/Salary";
import IDCards from "./pages/IDCards";
import FeeManagement from "./pages/FeeManagement";
import Schedule from "./pages/Schedule";
import Visitors from "./pages/Visitors";
import Inventory from "./pages/Inventory";
import InventoryTracking from "./pages/InventoryTracking";
import Calendar from "./pages/Calendar";
import HealthManagement from "./pages/HealthManagement";
import AccountSettings from "./pages/AccountSettings";
import Madrasa from "./pages/Madrasa";
import Hostel from "./pages/Hostel";
import Budget from "./pages/Budget";
import Homework from "./pages/Homework";
import StaffManagement from "./pages/StaffManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Parent Portal */}
            <Route
              path="/parent"
              element={
                <ProtectedRoute allowedRoles={["parent"]}>
                  <ParentDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Admin/Teacher/Staff Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff", "security", "head_teacher", "accountant"]}>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "head_teacher"]}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <ProtectedRoute allowedRoles={["admin", "head_teacher"]}>
                  <Teachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={["admin", "head_teacher"]}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "head_teacher"]}>
                  <Classes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "head_teacher"]}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin", "head_teacher"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/marks"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "head_teacher"]}>
                  <MarksEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "head_teacher"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute allowedRoles={["admin", "head_teacher"]}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["admin", "head_teacher"]}>
                  <SiteSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salary"
              element={
                <ProtectedRoute allowedRoles={["admin", "accountant", "head_teacher"]}>
                  <Salary />
                </ProtectedRoute>
              }
            />
            <Route
              path="/id-cards"
              element={
                <ProtectedRoute allowedRoles={["admin", "head_teacher"]}>
                  <IDCards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fees"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff", "accountant", "head_teacher"]}>
                  <FeeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/schedule"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff", "security", "head_teacher"]}>
                  <Schedule />
                </ProtectedRoute>
              }
            />
            <Route
              path="/visitors"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff", "security", "head_teacher"]}>
                  <Visitors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory/tracking"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff"]}>
                  <InventoryTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff", "security"]}>
                  <Inventory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff", "security", "parent", "head_teacher", "accountant"]}>
                  <Calendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/health"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff"]}>
                  <HealthManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account-settings"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff", "security", "parent"]}>
                  <AccountSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/madrasa"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff", "head_teacher"]}>
                  <Madrasa />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hostel"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff", "head_teacher"]}>
                  <Hostel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <ProtectedRoute allowedRoles={["admin", "staff", "accountant", "head_teacher"]}>
                  <Budget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/homework"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher", "head_teacher"]}>
                  <Homework />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-assignments"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
