// // import { Toaster } from "@/components/ui/toaster";
// // import { Toaster as Sonner } from "@/components/ui/sonner";
// // import { TooltipProvider } from "@/components/ui/tooltip";
// // import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// // import { BrowserRouter, Routes, Route } from "react-router-dom";
// // import Index from "./pages/Index";
// // import NotFound from "./pages/NotFound";

// // const queryClient = new QueryClient();

// // const App = () => (
// //   <QueryClientProvider client={queryClient}>
// //     <TooltipProvider>
// //       <Toaster />
// //       <Sonner />
// //       <BrowserRouter>
// //         <Routes>
// //           <Route path="/" element={<Index />} />
// //           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
// //           <Route path="*" element={<NotFound />} />
// //         </Routes>
// //       </BrowserRouter>
// //     </TooltipProvider>
// //   </QueryClientProvider>
// // );

// // export default App;
// // filepath: src/App.tsx
// import React, { useState } from 'react';
// import './App.css';
// import Sidebar from './components/Sidebar'; // Import the new Sidebar component
// import './styles/Sidebar.css'; // Import the new Sidebar styles
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// // Placeholder components for routes
// const Dashboard = () => <div><h1>Dashboard Content</h1></div>;
// const Templates = () => <div><h1>Templates Content</h1></div>;
// const CreateNew = () => <div><h1>Create New Bot Content</h1></div>;
// const Campaigns = () => <div><h1>Campaigns Content</h1></div>;

// function App() {
//   const [isSidebarHovered, setIsSidebarHovered] = useState(false);

//   const handleLinkClick = (linkName: string) => {
//     console.log(`Sidebar link clicked: ${linkName}`);
//     // The Link component handles navigation, this can be used for other side effects
//   };

//   const handleSidebarHoverChange = (hovered: boolean) => {
//     setIsSidebarHovered(hovered);
//   };

//   return (
//     <Router>
//       <div className="app-layout">
//         <Sidebar onLinkClick={handleLinkClick} onHoverChange={handleSidebarHoverChange} />
//         <div className={`main-content-area ${isSidebarHovered ? 'sidebar-expanded' : ''}`}>
//           <Routes>
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/templates" element={<Templates />} />
//             <Route path="/createNew" element={<Index />} />
//             <Route path="/campaigns" element={<Campaigns />} />
//             {/* Default route */}
//             <Route path="/" element={<Dashboard />} />
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

// filepath: /Users/prasadhajare/whats_app_dev/msg-canvas-flow-main/src/App.tsx
import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/whatsapp/Sidebar';
import './styles/Sidebar.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Index from "./pages/whatsapp/Index"; // Ensure Index is imported
import NotFound from "./pages/whatsapp/NotFound"; // Ensure NotFound is imported
import Templates from "./components/whatsapp/TemplateCreator";
import TemplatesList from './pages/whatsapp/TemplatesList';
import TemplatesEditor from './pages/whatsapp/TemplatesEditor';
// Ads manager pages
import AdsIndex from './pages/ads/Index';
import AdsOnboarding from './pages/ads/Onboarding';
import AdsDashboard from './pages/ads/Dashboard';
import AdsCampaigns from './pages/ads/Campaigns';
import AdsCreateCampaign from './pages/ads/CreateCampaign';
import AdsAICampaign from './pages/ads/AICampaign';
import AdsNotFound from './pages/ads/NotFound';
// Placeholder components for routes
const Dashboard = () => <div><h1>Dashboard Content</h1></div>;
// const Templates = () => <div><h1>Templates Content</h1></div>;
// const CreateNew = () => <div><h1>Create New Bot Content</h1></div>; // This is replaced by Index
const Campaigns = () => <div><h1>Campaigns Content</h1></div>;

function App() {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [managerMode, setManagerMode] = useState('whatsapp'); // 'whatsapp' or 'ads'
  const sidebarCollapsedWidth = 10; // Define sidebar widths
  const sidebarExpandedWidth = 5;

  const handleLinkClick = (linkName: string) => {
    console.log(`Sidebar link clicked: ${linkName}`);
  };

  const handleSidebarHoverChange = (hovered: boolean) => {
    setIsSidebarHovered(hovered);
  };

  const currentSidebarWidth = isSidebarHovered ? sidebarExpandedWidth : sidebarCollapsedWidth;

  // Watch the current route (inside Router) and set managerMode accordingly
  function RouteWatcher() {
    const location = useLocation();
    useEffect(() => {
      const p = location.pathname || '/';
      // If URL path starts with /ads use ads manager; if starts with /wa use whatsapp manager
      if (p.startsWith('/ads')) {
        setManagerMode('ads');
      } else if (p.startsWith('/wa')) {
        setManagerMode('whatsapp');
      } else {
        // keep current default (whatsapp) for root and unknown paths
        // but if you want other heuristics, add here
        setManagerMode('ads');
      }
    }, [location.pathname]);
    return null;
  }

  return (
    <Router>
      <div className="flex  h-full w-full">
        <RouteWatcher />
  <Sidebar onLinkClick={handleLinkClick} onHoverChange={handleSidebarHoverChange} onManagerChange={(m) => setManagerMode(m)} activeManager={managerMode} />
        <div className={`main-content-area ${isSidebarHovered ? 'sidebar-expanded' : ''}`}>
          <Routes>
            {/* Ads routes (always registered) */}
            <Route path="/ads/onboarding" element={<AdsOnboarding />} />
            <Route path="/ads/dashboard" element={<AdsDashboard />} />
            <Route path="/ads/campaigns" element={<AdsCampaigns />} />
            <Route path="/ads/campaigns/create" element={<AdsCreateCampaign />} />
            <Route path="/ads/ai-campaign" element={<AdsAICampaign />} />
            <Route path="/ads/audiences" element={<AdsDashboard />} />
            <Route path="/ads/billing" element={<AdsDashboard />} />
            <Route path="/ads/settings" element={<AdsDashboard />} />
            <Route path="/ads/" element={<AdsIndex />} />

            {/* WhatsApp (WA) routes (always registered) */}
            <Route path="/wa/dashboard" element={<Dashboard />} />
            <Route path="/wa/templates" element={<TemplatesList isSidebarHovered={isSidebarHovered} />} />
            <Route path="/wa/templates/new" element={<Templates isSidebarHovered={isSidebarHovered} initialTemplateJson={null} />} />
            <Route path="/wa/templates/edit/:id" element={<TemplatesEditor isSidebarHovered={isSidebarHovered} />} />
            <Route path="/wa/createNew" element={<Index  />} />
            <Route path="/wa/campaigns" element={<Campaigns />} />

            {/* Default root route: decide based on managerMode to preserve previous UX */}
            <Route path="/" element={managerMode === 'ads' ? <AdsIndex /> : <Dashboard />} />

            {/* Fallbacks: keep specific not-found handlers for ads and wa prefixes */}
            <Route path="/ads/*" element={<AdsNotFound />} />
            <Route path="/wa/*" element={<NotFound />} />

            {/* Global fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;