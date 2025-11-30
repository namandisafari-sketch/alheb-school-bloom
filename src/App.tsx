import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Staff from "./pages/Staff";
import Auth from "./pages/Auth";
import ParentDashboard from "./pages/ParentDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
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
                <ProtectedRoute allowedRoles={["admin", "teacher", "staff"]}>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/students"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <Students />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teachers"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Teachers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Staff />
                </ProtectedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <Classes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute allowedRoles={["admin", "teacher"]}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
