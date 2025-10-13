import React from "react";

const Index = () => {
  const handleLoginRedirect = () => {
    // Replace with your actual backend URL
    const backendUrl = "http://localhost:8080/auth/facebook";
    window.location.href = backendUrl;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to Your App</h1>
        <p className="text-xl text-muted-foreground mb-6">Click below to login with Facebook</p>
        <button
          onClick={handleLoginRedirect}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Login with Facebook
        </button>
      </div>
    </div>
  );
};

export default Index;
