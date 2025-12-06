// filepath: src/components/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userImage from '../../assets/images/user.png';
// import userImage from '../assets/images/user.png';
import dashboardImage from '../../assets/images/dashboard.png';
import templateImage from '../../assets/images/template.png';
import marketing from '../../assets/images/marketing.png';
import bot from '../../assets/images/bot.png';

import dashboardImaged from '../../assets/images/dashboard.png';
import templateImaged from '../../assets/images/template.png';
import marketingd from '../../assets/images/marketing.png';
import botd from '../../assets/images/bot.png';

import createNewImage from '../assets/images/projects.png'; // Note: This is imported but 'bot' image is used for 'Create New Bot' link
import PropTypes from 'prop-types';
import {
  LayoutDashboard,
  Megaphone,
  Sparkles,
  Users,
  CreditCard,
  Settings,
  MessageSquare,
  BarChart2,
  LogIn,
  MessageCircle,
  User,
  LogOut,
  Image,
  Video,
  Send,
  FileText,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


type SidebarProps = {
  onLinkClick: (key: string) => void;
  onHoverChange: (hovered: boolean) => void;
  onManagerChange?: (m: 'whatsapp' | 'ads' | 'instagram') => void;
  activeManager?: 'whatsapp' | 'ads' | 'instagram';
};

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, onHoverChange, onManagerChange, activeManager }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [manager, setManager] = useState<'whatsapp' | 'ads' | 'instagram'>(activeManager || 'whatsapp');
  const navigate = useNavigate();
  // Auth context for conditional navigation
  // eslint-disable-next-line
  let user = null;
  try {
    // Dynamically import useAuth to avoid breaking SSR
    // @ts-ignore
    user = require('@/contexts/AuthContext').useAuth().user;
  } catch (e) {
    user = null;
  }

  const switchManager = (m: 'whatsapp' | 'ads' | 'instagram') => {
    setManager(m);
    if (onManagerChange) onManagerChange(m);
    // navigate to the prefixed dashboard for the selected manager
    if (m === 'ads') navigate('/ads/dashboard');
    else if (m === 'instagram') navigate('/ig/dashboard');
    else navigate('/wa/dashboard');
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const handleLogout = async () => {
    try {
      // Clear authentication state
      if (user) {
        // If using Supabase auth, clear the session
        const { supabase } = await import('@/lib/supabase/client');
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  // Extract actual user data from Supabase authentication
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "user@example.com";
  const userPhoto = user?.user_metadata?.avatar_url || null;

  useEffect(() => {
    onHoverChange(hovered);
  }, [hovered, onHoverChange]);

  // Keep local manager state in sync with parent-provided activeManager.
  useEffect(() => {
    if (activeManager && activeManager !== manager) {
      setManager(activeManager);
    }
    // intentionally not calling onManagerChange here — parent is the source
    // of truth for the active manager and RouteWatcher will set it.
    // Sidebar updates the parent only on explicit user actions (switchManager).
  }, [activeManager, manager]);

  // Get current path to highlight active link
  const currentPath = window.location.pathname;

  // WhatsApp brand color (light green), Ads brand color (elegant light blue), and Instagram brand color (pink/purple)
  const whatsappColor = '#25D366'; // WhatsApp green
  const whatsappBg = '#E8F5E9'; // Light green background
  const adsColor = '#4A90E2'; // Elegant blue
  const adsBg = '#E3F2FD'; // Light blue background
  const instagramColor = '#E1306C'; // Instagram pink
  const instagramBg = '#FFF5F7'; // Light pink background

  const activeColor = manager === 'whatsapp' ? whatsappColor : manager === 'instagram' ? instagramColor : adsColor;
  const activeBg = manager === 'whatsapp' ? whatsappBg : manager === 'instagram' ? instagramBg : adsBg;

  return (
    <>
        <div
            className="side-nav"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              background: manager === 'whatsapp' 
                ? 'linear-gradient(to bottom, #f0fdf4, #ffffff)' 
                : manager === 'instagram' 
                  ? 'linear-gradient(to bottom, #fff5f7, #ffffff)' 
                  : 'linear-gradient(to bottom, #eff6ff, #ffffff)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
              left: '0px',
              borderRight: manager === 'whatsapp' 
                ? '1px solid rgba(37, 211, 102, 0.2)' 
                : manager === 'instagram' 
                  ? '1px solid rgba(225, 48, 108, 0.2)' 
                  : '1px solid rgba(74, 144, 226, 0.2)',
              boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
            }}
        >
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', flex: 1, overflowY: 'auto' }}>
            {manager === 'whatsapp' ? (
              <>
                <li className="show-dashboard" onClick={() => onLinkClick('wa-dashboard')}>
                  <Link to="/wa/dashboard" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/wa/dashboard' ? activeBg : 'transparent',
                        color: currentPath === '/wa/dashboard' ? activeColor : '#374159',
                        padding: '0.5rem 0.35rem',
                        
                        // margin: 0,
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <LayoutDashboard size={27} style={{ color: currentPath === '/wa/dashboard' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/wa/dashboard' ? '600' : '500', whiteSpace: 'nowrap' }}>Dashboard</p>
                    </div>
                  </Link>
                </li>
                <li className="show-template" onClick={() => onLinkClick('wa-templates')}>
                  <Link to="/wa/templates" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/wa/templates' ? activeBg : 'transparent',
                        color: currentPath === '/wa/templates' ? activeColor : '#374151',
                        padding: '0.5rem 0.35rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {/* <FileText className="text-emerald-500 w-7 h-7" /> */}
                      <FileText size={27} style={{ color: currentPath === '/wa/templates' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/wa/templates' ? '600' : '500', whiteSpace: 'nowrap' }}>Templates</p>
                    </div>
                  </Link>
                </li>
                {/*
                <li className="create-new" onClick={() => onLinkClick('wa-createNew')}>
                  <Link to="/wa/createNew" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/wa/createNew' ? activeBg : 'transparent',
                        color: currentPath === '/wa/createNew' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Sparkles size={27} style={{ color: currentPath === '/wa/createNew' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/wa/createNew' ? '600' : '500', whiteSpace: 'nowrap' }}>Bot</p>
                    </div>
                  </Link>
                </li>
                */}
                <li className="manage-campaigns" onClick={() => onLinkClick('wa-campaigns')}>
                  <Link to="/wa/campaigns" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      title="Create and manage WhatsApp broadcast campaigns"
                      style={{
                        background: currentPath === '/wa/campaigns' ? activeBg : 'transparent',
                        color: currentPath === '/wa/campaigns' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {/* <Send className="text-emerald-500 w-7 h-7" /> */}
                      <Send size={27} style={{ color: currentPath === '/wa/campaigns' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/wa/campaigns' ? '600' : '500', whiteSpace: 'nowrap' }}>Campaigns</p>
                    </div>
                  </Link>
                </li>
                <li className="live-chat" onClick={() => {
                  onLinkClick('wa-live-chat');
                  if (user) {
                    navigate('/wa/live-chat/chats');
                  } else {
                   navigate('/wa/live-chat/chats');
                  }
                }}>
                  <div 
                    className="sidebar-item sidebar-link"
                    style={{
                      background: currentPath.startsWith('/wa/live-chat') ? activeBg : 'transparent',
                      color: currentPath.startsWith('/wa/live-chat') ? activeColor : '#374151',
                      padding: '0.5rem 0.25rem',
                      borderRadius: '7px',
                      marginLeft: '0.75rem',
                      marginRight: '0.75rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                    }}
                  >
                    <MessageCircle size={27} style={{ color: currentPath.startsWith('/wa/live-chat') ? activeColor : '#6B7280', flexShrink: 0 }} />
                    <p className="text_4" style={{ margin: 0, fontWeight: currentPath.startsWith('/wa/live-chat') ? '600' : '500', whiteSpace: 'nowrap' }}>Live Chat</p>
                  </div>
                </li>
                <li className="settings" onClick={() => onLinkClick('wa-settings')}>
                  <Link to="/wa/settings" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      title="Manage your account, phone numbers, and business preferences"
                      style={{
                        background: currentPath === '/wa/settings' ? activeBg : 'transparent',
                        color: currentPath === '/wa/settings' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Settings size={27} style={{ color: currentPath === '/wa/settings' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/wa/settings' ? '600' : '500', whiteSpace: 'nowrap' }}>Settings</p>
                    </div>
                  </Link>
                </li>
              </>
            ) : manager === 'instagram' ? (
              <>
                {/* Instagram manager navigation with pink/purple theme */}
                <li onClick={() => onLinkClick('ig-dashboard')}>
                  <Link to="/ig/dashboard" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ig/dashboard' ? activeBg : 'transparent',
                        color: currentPath === '/ig/dashboard' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        paddingLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <LayoutDashboard size={27} style={{ color: currentPath === '/ig/dashboard' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ig/dashboard' ? '600' : '500', whiteSpace: 'nowrap' }}>Dashboard</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ig-posts')}>
                  <Link to="/ig/posts" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ig/posts' ? activeBg : 'transparent',
                        color: currentPath === '/ig/posts' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        paddingLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Image size={27} style={{ color: currentPath === '/ig/posts' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ig/posts' ? '600' : '500', whiteSpace: 'nowrap' }}>Posts</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ig-stories')}>
                  <Link to="/ig/stories" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ig/stories' ? activeBg : 'transparent',
                        color: currentPath === '/ig/stories' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        paddingLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Video size={27} style={{ color: currentPath === '/ig/stories' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ig/stories' ? '600' : '500', whiteSpace: 'nowrap' }}>Stories</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ig-direct-messages')}>
                  <Link to="/ig/direct-messages" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ig/direct-messages' ? activeBg : 'transparent',
                        color: currentPath === '/ig/direct-messages' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <MessageCircle size={27} style={{ color: currentPath === '/ig/direct-messages' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ig/direct-messages' ? '600' : '500', whiteSpace: 'nowrap' }}>Direct</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ig-analytics')}>
                  <Link to="/ig/analytics" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ig/analytics' ? activeBg : 'transparent',
                        color: currentPath === '/ig/analytics' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <BarChart2 size={27} style={{ color: currentPath === '/ig/analytics' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ig/analytics' ? '600' : '500', whiteSpace: 'nowrap' }}>Analytics</p>
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Ads manager navigation with elegant blue theme */}
                <li onClick={() => onLinkClick('ads-dashboard')}>
                  <Link to="/ads/dashboard" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/dashboard' ? activeBg : 'transparent',
                        color: currentPath === '/ads/dashboard' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        paddingLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <LayoutDashboard size={27} style={{ color: currentPath === '/ads/dashboard' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/dashboard' ? '600' : '500', whiteSpace: 'nowrap' }}>Dashboard</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-campaigns')}>
                  <Link to="/ads/campaigns" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/campaigns' ? activeBg : 'transparent',
                        color: currentPath === '/ads/campaigns' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        paddingLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Megaphone size={27} style={{ color: currentPath === '/ads/campaigns' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/campaigns' ? '600' : '500', whiteSpace: 'nowrap' }}>Campaigns</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-ai-campaign')}>
                  <Link to="/ads/ai-campaign" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/ai-campaign' ? activeBg : 'transparent',
                        color: currentPath === '/ads/ai-campaign' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        paddingLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Sparkles size={27} style={{ color: currentPath === '/ads/ai-campaign' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/ai-campaign' ? '600' : '500', whiteSpace: 'nowrap' }}>AI Campaign</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-ctwa')}>
                  <Link to="/ads/ctwa" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/ctwa' ? activeBg : 'transparent',
                        color: currentPath === '/ads/ctwa' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <MessageCircle size={27} style={{ color: currentPath === '/ads/ctwa' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/ctwa' ? '600' : '500', whiteSpace: 'nowrap' }}>CTWA</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-audiences')}>
                  <Link to="/ads/audiences" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/audiences' ? activeBg : 'transparent',
                        color: currentPath === '/ads/audiences' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Users size={27} style={{ color: currentPath === '/ads/audiences' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/audiences' ? '600' : '500', whiteSpace: 'nowrap' }}>Audiences</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-billing')}>
                  <Link to="/ads/billing" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/billing' ? activeBg : 'transparent',
                        color: currentPath === '/ads/billing' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <CreditCard size={27} style={{ color: currentPath === '/ads/billing' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/billing' ? '600' : '500', whiteSpace: 'nowrap' }}>Billing</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-settings')}>
                  <Link to="/ads/settings" className="sidebar-link">
                    <div 
                      className="sidebar-item"
                      style={{
                        background: currentPath === '/ads/settings' ? activeBg : 'transparent',
                        color: currentPath === '/ads/settings' ? activeColor : '#374151',
                        padding: '0.5rem 0.25rem',
                        borderRadius: '7px',
                        marginLeft: '0.75rem',
                        marginRight: '0.75rem',
                        // margin: 0,
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Settings size={27} style={{ color: currentPath === '/ads/settings' ? activeColor : '#6B7280', flexShrink: 0 }} />
                      <p className="text_4" style={{ margin: 0, fontWeight: currentPath === '/ads/settings' ? '600' : '500', whiteSpace: 'nowrap' }}>Settings</p>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
          {/* User Profile Dropdown at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-3 border-t"
            style={{
              borderTopColor: manager === 'whatsapp' 
                ? 'rgba(37, 211, 102, 0.2)' 
                : manager === 'instagram' 
                  ? 'rgba(225, 48, 108, 0.2)' 
                  : 'rgba(74, 144, 226, 0.2)',
              background: manager === 'whatsapp' 
                ? 'linear-gradient(to top, #f0fdf4, transparent)' 
                : manager === 'instagram' 
                  ? 'linear-gradient(to top, #fff5f7, transparent)' 
                  : 'linear-gradient(to top, #eff6ff, transparent)',
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start p-2 hover:bg-opacity-50"
                  style={{
                    background: 'transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    {userPhoto ? (
                      <AvatarImage src={userPhoto} alt={userName || "User"} />
                    ) : (
                      <AvatarImage src="/placeholder.svg" alt="User" />
                    )}
                    <AvatarFallback 
                      style={{
                        background: manager === 'whatsapp' ? whatsappColor : manager === 'instagram' ? instagramColor : adsColor,
                        color: 'white',
                      }}
                    >
                      {userName ? userName.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* <span className="text-sm font-medium" style={{ color: '#374151' }}>{userName}</span> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    {userName && (
                      <p className="text-sm font-medium leading-none">{userName}</p>
                    )}
                    {userEmail && (
                      <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" style={{ color: manager === 'whatsapp' ? whatsappColor : manager === 'instagram' ? instagramColor : adsColor }} />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" style={{ color: manager === 'whatsapp' ? whatsappColor : manager === 'instagram' ? instagramColor : adsColor }} />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" style={{ color: '#de628a' }} />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

Sidebar.propTypes = {
  onLinkClick: PropTypes.func.isRequired,
  onHoverChange: PropTypes.func.isRequired,
  onManagerChange: PropTypes.func,
};

export default Sidebar;