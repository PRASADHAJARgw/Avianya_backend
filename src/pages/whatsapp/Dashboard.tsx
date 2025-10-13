import React, { useEffect, useState } from 'react';

type DashboardProps = {
  isSidebarHovered?: boolean;
};

const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">WhatsApp Dashboard</h1>
      <p className="mb-4">Click the button below to sign up via Facebook (opens the signup page).</p>

      <button
        type="button"
        onClick={() => { window.location.href = 'https://c8lfkbnn-8080.inc1.devtunnels.ms/signup'; }}
        // onClick={() => { window.location.href = 'https://www.facebook.com/v19.0/dialog/oauth?client_id=854691066995662&redirect_uri=https://localhost:3000/wa/templates&response_type=code&scope=whatsapp_business_management,whatsapp_business_messaging,business_management&config_id=821099010315888&state=a_unique_and_random_string_for_security'; }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign up with Facebook
      </button>
    </div>
  );
};

export default Dashboard;
