
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import Layout from './Layout';

// Import all your page components
import CoreCompassHome from './pages/CoreCompassHome';
import CoreCoachHome from './pages/CoreCoachHome';
import SetupProfile from './pages/SetupProfile';
import Dashboard from './pages/Dashboard';
import CoachDashboard from './pages/CoachDashboard';
import NewEntry from './pages/NewEntry';
import Chat from './pages/Chat';
import Entries from './pages/Entries';
import Profile from './pages/Profile';
import Resources from './pages/Resources';
import Messages from './pages/Messages';
import MyCoach from './pages/MyCoach';
import Breakthroughs from './pages/Breakthroughs';
import PersonalityTests from './pages/PersonalityTests';
import ClientManagement from './pages/ClientManagement';
import CoachSchedule from './pages/CoachSchedule';
import CoachAnalytics from './pages/CoachAnalytics';
import CoachBreakthroughs from './pages/CoachBreakthroughs';
import Goals from './pages/Goals'; // Import the new Goals page

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CoreCompassHome />} />
      <Route path="/core-compass-home" element={<CoreCompassHome />} />
      <Route path="/core-coach-home" element={<CoreCoachHome />} />
      <Route path="/setup-profile" element={<SetupProfile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/coach-dashboard" element={<CoachDashboard />} />
      <Route path="/new-entry" element={<NewEntry />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/ask-yourself" element={<Chat />} />
      <Route path="/entries" element={<Entries />} />
      <Route path="/my-notes" element={<Entries />} />
      <Route path="/goals" element={<Goals />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resource-library" element={<Resources />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/my-coach" element={<MyCoach />} />
      <Route path="/breakthroughs" element={<Breakthroughs />} />
      <Route path="/personality-tests" element={<PersonalityTests />} />
      <Route path="/client-management" element={<ClientManagement />} />
      <Route path="/coach-schedule" element={<CoachSchedule />} />
      <Route path="/schedule" element={<CoachSchedule />} />
      <Route path="/coach-analytics" element={<CoachAnalytics />} />
      <Route path="/analytics" element={<CoachAnalytics />} />
      <Route path="/coach-breakthroughs" element={<CoachBreakthroughs />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </AuthProvider>
    </Router>
  );
}
