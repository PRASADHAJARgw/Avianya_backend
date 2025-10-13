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
} from 'lucide-react';


type SidebarProps = {
  onLinkClick: (key: string) => void;
  onHoverChange: (hovered: boolean) => void;
  onManagerChange?: (m: 'whatsapp' | 'ads') => void;
  activeManager?: 'whatsapp' | 'ads';
};

const Sidebar: React.FC<SidebarProps> = ({ onLinkClick, onHoverChange, onManagerChange, activeManager }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [manager, setManager] = useState<'whatsapp' | 'ads'>(activeManager || 'whatsapp');
  const navigate = useNavigate();

  const switchManager = (m: 'whatsapp' | 'ads') => {
    setManager(m);
    if (onManagerChange) onManagerChange(m);
    // navigate to the prefixed dashboard for the selected manager
    if (m === 'ads') navigate('/ads/dashboard');
    else navigate('/wa/dashboard');
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

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

  return (
    <>
      {/* <div className='text-foreground'> */}
        <div
            className="side-nav"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
          <div className="user_img">
          <img src={userImage} className="user-img" />
          </div>
          <div className="user">
           <div className="user-info">
                <h2>Prasad Hajare</h2>
                <p>prasad@avianya.ai</p>
            </div>
          </div>
          <ul>
            {manager === 'whatsapp' ? (
              <>
                <li className="show-dashboard" onClick={() => onLinkClick('wa-dashboard')}>
                  <Link to="/wa/dashboard" className="sidebar-link">
                    <div className="sidebar-item  text-foreground">
                      <img src={dashboardImage} alt="Dashboard" />
                      <p className="text_4">Dashboard</p>
                    </div>
                  </Link>
                </li>
                <li className="show-template" onClick={() => onLinkClick('wa-templates')}>
                  <Link to="/wa/templates" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <img src={templateImage} alt="Templates" />
                      <p className="text_4">Templates</p>
                    </div>
                  </Link>
                </li>
                <li className="create-new" onClick={() => onLinkClick('wa-createNew')}>
                  <Link to="/wa/createNew" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <img src={bot} alt="Bot" />
                      <p className="text_4">Bot</p>
                    </div>
                  </Link>
                </li>
                <li className="manage-campaigns" onClick={() => onLinkClick('wa-campaigns')}>
                  <Link to="/wa/campaigns" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <img src={marketing} alt="Campaigns" />
                      <p className="text_4">Campaigns</p>
                    </div>
                  </Link>
                </li>
              </>
            ) : (
              <>
                {/* Ads manager navigation (icons) */}
                <li onClick={() => onLinkClick('ads-dashboard')}>
                  <Link to="/ads/dashboard" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <LayoutDashboard />
                      <p className="text_4 ml-2">Dashboard</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-campaigns')}>
                  <Link to="/ads/campaigns" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <Megaphone />
                      <p className="text_4 ml-2">Campaigns</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-ai-campaign')}>
                  <Link to="/ads/ai-campaign" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <Sparkles />
                      <p className="text_4 ml-2">AI Campaign</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-audiences')}>
                  <Link to="/ads/audiences" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <Users />
                      <p className="text_4 ml-2">Audiences</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-billing')}>
                  <Link to="/ads/billing" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <CreditCard />
                      <p className="text_4 ml-2">Billing</p>
                    </div>
                  </Link>
                </li>
                <li onClick={() => onLinkClick('ads-settings')}>
                  <Link to="/ads/settings" className="sidebar-link">
                    <div className="sidebar-item text-foreground">
                      <Settings />
                      <p className="text_4 ml-2">Settings</p>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>
          {/* Manager toggle - vertical buttons */}
          <div className="manager-toggle p-3 flex flex-col items-center">
            <button
              type="button"
              onClick={() => switchManager('whatsapp')}
              className={`toggle-btn mb-2 p-2 rounded ${manager === 'whatsapp' ? 'bg-primary text-white' : 'bg-transparent'}`}
              aria-label="Switch to WhatsApp Manager"
              title="WhatsApp Manager"
            >
              <MessageSquare />
            </button>

            <button
              type="button"
              onClick={() => switchManager('ads')}
              className={`toggle-btn p-2 rounded ${manager === 'ads' ? 'bg-primary text-white' : 'bg-transparent'}`}
              aria-label="Switch to Ads Manager"
              title="Ads Manager"
            >
              <Megaphone />
            </button>
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