import React from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import GoogleSignInButton from "./components/GoogleSignInButton";
import UserDashboard from "./components/UserDashboard";
import "./index.css";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {user ? (
        <UserDashboard />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 className="text-2xl font-bold text-center mb-6">
              Welcome to MERN App
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Sign in with Google to get started
            </p>
            <GoogleSignInButton />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
