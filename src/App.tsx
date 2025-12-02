import React, { useState, useEffect } from 'react';
import './App.css';
import './styles/Sidebar.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import Index from "./pages/whatsapp/Index"; // Ensure Index is imported
import NotFound from "./pages/whatsapp/NotFound"; // Ensure NotFound is imported
import Templates from "./components/whatsapp/TemplateCreator";
import TemplatesList from './pages/whatsapp/TemplatesList';
import TemplatesEditor from './pages/whatsapp/TemplatesEditor';
import Campaigns from './pages/whatsapp/Campaigns';
// Live Chat with Auth
import LiveChatLogin from './pages/whatsapp/LiveChatLogin';
import ForgotPassword from './pages/whatsapp/ForgotPassword';
import LiveChatPanel from './pages/whatsapp/LiveChatPanel';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ContactsPage from './pages/whatsapp/ContactsPage';
import Signup from './pages/Signup';
import UsersPage from './pages/whatsapp/UsersPage';
import UserCreateEditPage from './pages/whatsapp/UserCreateEditPage';
// Ads manager pages
import AdsIndex from './pages/ads/Index';
import AdsOnboarding from './pages/ads/Onboarding';
import AdsDashboard from './pages/ads/Dashboard';
import AdsCampaigns from './pages/ads/Campaigns';
import AdsCreateCampaign from './pages/ads/CreateCampaign';
import AdsAICampaign from './pages/ads/AICampaign';
import AdsNotFound from './pages/ads/NotFound';
import WaDashboard from './pages/whatsapp/Dashboard';
import CTWA from './pages/ads/ctwa';
// Instagram manager pages
import InstagramIndex from './pages/instagram/Index';
import InstagramDashboard from './pages/instagram/Dashboard';
import InstagramPosts from './pages/instagram/Posts';
import InstagramStories from './pages/instagram/Stories';
import InstagramDirectMessages from './pages/instagram/DirectMessages';
import InstagramAnalytics from './pages/instagram/Analytics';
import InstagramNotFound from './pages/instagram/NotFound';
// Placeholder components for routes
// const Dashboard = () => <div><h1>Dashboard Contents</h1></div>;
// const Templates = () => <div><h1>Templates Content</h1></div>;
// const CreateNew = () => <div><h1>Create New Bot Content</h1></div>; // This is replaced by Index

function RootRoutes() {
  const { user } = useAuth();
  const loginRoutes = ["/", "/login", "/signup", "/wa/live-chat/login", "/wa/live-chat/forgot-password"];
  const currentPath = window.location.pathname;
  const isLoginRoute = loginRoutes.includes(currentPath);
  return (
    isLoginRoute ? (
      <Routes>
        <Route path="/" element={<LiveChatLogin />} />
        <Route path="/login" element={<LiveChatLogin />} />
        <Route path="/signup" element={<LiveChatLogin />} />
        <Route path="/wa/live-chat/login" element={<LiveChatLogin />} />
        <Route path="/wa/live-chat/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<LiveChatLogin />} />
      </Routes>
    ) : (
      <MainLayout>
        <Routes>
          <Route path="/wa/live-chat" element={<Navigate to="/wa/live-chat/chats" replace />} />
          <Route path="/wa/live-chat/chats" element={<ProtectedRoute><LiveChatPanel /></ProtectedRoute>} />
          <Route path="/wa/live-chat/chats/:waId" element={<ProtectedRoute><LiveChatPanel /></ProtectedRoute>} />
          <Route path="/wa/contacts" element={<ProtectedRoute><ContactsPage /></ProtectedRoute>} />
          <Route path="/wa/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/wa/users/new" element={<ProtectedRoute><UserCreateEditPage /></ProtectedRoute>} />
          {/* Ads routes */}
          <Route path="/ads/onboarding" element={<AdsOnboarding />} />
          <Route path="/ads/dashboard" element={<AdsDashboard />} />
          <Route path="/ads/campaigns" element={<AdsCampaigns />} />
          <Route path="/ads/ctwa" element={<CTWA />} />
          <Route path="/ads/campaigns/create" element={<AdsCreateCampaign />} />
          <Route path="/ads/ai-campaign" element={<AdsAICampaign />} />
          <Route path="/ads/audiences" element={<AdsDashboard />} />
          <Route path="/ads/billing" element={<AdsDashboard />} />
          <Route path="/ads/settings" element={<AdsDashboard />} />
          <Route path="/ads/" element={<AdsIndex />} />
          {/* WhatsApp (WA) routes */}
          <Route path="/wa/dashboard" element={<WaDashboard />} />
          <Route path="/wa/templates" element={<TemplatesList isSidebarHovered={false} />} />
          <Route path="/wa/templates/new" element={<Templates isSidebarHovered={false} initialTemplateJson={null} />} />
          <Route path="/wa/templates/edit/:id" element={<TemplatesEditor isSidebarHovered={false} />} />
          <Route path="/wa/createNew" element={<Index  />} />
          <Route path="/wa/campaigns" element={<Campaigns />} />
          {/* Instagram (IG) routes */}
          <Route path="/ig/" element={<InstagramIndex />} />
          <Route path="/ig/dashboard" element={<InstagramDashboard />} />
          <Route path="/ig/posts" element={<InstagramPosts />} />
          <Route path="/ig/stories" element={<InstagramStories />} />
          <Route path="/ig/direct-messages" element={<InstagramDirectMessages />} />
          <Route path="/ig/analytics" element={<InstagramAnalytics />} />
          {/* Fallbacks: specific not-found handlers */}
          <Route path="/ads/*" element={<AdsNotFound />} />
          <Route path="/wa/*" element={<NotFound />} />
          <Route path="/ig/*" element={<InstagramNotFound />} />
          {/* Global fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MainLayout>
    )
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <RootRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;