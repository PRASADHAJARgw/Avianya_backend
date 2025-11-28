import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../whatsapp/Sidebar';
import { Header } from '../whatsapp/Header';
import '../../styles/Sidebar.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [managerMode, setManagerMode] = useState<'whatsapp' | 'ads' | 'instagram'>('whatsapp');
  const location = useLocation();
  
  const sidebarCollapsedWidth = '4rem';
  const sidebarExpandedWidth = '10rem';

  const handleLinkClick = (linkName: string) => {
    console.log(`Sidebar link clicked: ${linkName}`);
  };

  const handleSidebarHoverChange = (hovered: boolean) => {
    setIsSidebarHovered(hovered);
  };

  const currentSidebarWidth = isSidebarHovered ? sidebarExpandedWidth : sidebarCollapsedWidth;

  // Watch the current route and set managerMode accordingly
  useEffect(() => {
    const p = location.pathname || '/';
    if (p.startsWith('/ads')) {
      setManagerMode('ads');
    } else if (p.startsWith('/wa')) {
      setManagerMode('whatsapp');
    } else if (p.startsWith('/ig')) {
      setManagerMode('instagram');
    } else {
      setManagerMode('whatsapp');
    }
  }, [location.pathname]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    }}>
      {/* Header at the top - Fixed positioning */}
      <div style={{ 
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <Header 
          onManagerChange={(m) => setManagerMode(m)} 
          activeManager={managerMode}
        />
      </div>
      
      {/* Main content area with sidebar and pages */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden', 
        minHeight: 0,
        position: 'relative'
      }}>
        <div
          style={{
            width: currentSidebarWidth,
            minWidth: currentSidebarWidth,
            maxWidth: currentSidebarWidth,
            transition: 'width 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
            height: '100%',
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            zIndex: 40,
            backgroundColor: 'white',
            borderRight: '1px solid #e5e7eb'
          }}
        >
          <Sidebar 
            onLinkClick={handleLinkClick} 
            onHoverChange={handleSidebarHoverChange} 
            onManagerChange={(m) => setManagerMode(m)} 
            activeManager={managerMode} 
          />
        </div>
        <div 
          className="main-content-area"
          style={{
            flex: 1,
            overflow: 'auto',
            minWidth: 0,
            position: 'relative',
            zIndex: 1,
            backgroundColor: '#f9fafb'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
