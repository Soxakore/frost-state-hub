import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { FrostShell } from "@/components/frost/FrostShell";
import { AlliancesPage, EventsPage, GovernorPage, GuidesPage, HomePage, ReportPage, RulesPage, SvsPage, TransferPage } from "@/components/frost/PublicPages";
import { TermsPage, PrivacyPage } from "@/components/frost/LegalPages";
import { ForgotPasswordPage, LoginPage, ProfilePage, RegisterPage, ResetPasswordPage } from "@/components/frost/AuthPages";
import { AllianceManager, AnnouncementsManager, AuditLogPage, DashboardHome, DashboardLayout, EventsManager, GovernorManager, GuidesManager, RulesManager, SvsNotesManager, TransferManager, TransferSettingsManager, UsersManager } from "@/components/frost/Dashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <AuthProvider>
          <Routes>
            <Route element={<FrostShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/transfer" element={<TransferPage />} />
              <Route path="/alliances" element={<AlliancesPage />} />
              <Route path="/svs" element={<SvsPage />} />
              <Route path="/governor" element={<GovernorPage />} />
              <Route path="/guides" element={<GuidesPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="events" element={<EventsManager />} />
                <Route path="alliances" element={<AllianceManager />} />
                <Route path="rules" element={<RulesManager />} />
                <Route path="transfer" element={<TransferManager />} />
                <Route path="transfer-settings" element={<TransferSettingsManager />} />
                <Route path="governor" element={<GovernorManager />} />
                <Route path="announcements" element={<AnnouncementsManager />} />
                <Route path="users" element={<UsersManager />} />
                <Route path="audit" element={<AuditLogPage />} />
                <Route path="guides" element={<GuidesManager />} />
                <Route path="svs-notes" element={<SvsNotesManager />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
