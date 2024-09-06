// src/components/Login.tsx
import React from "react";
import { authService } from "../services/authService";

const Login: React.FC = () => {
  const handleLogin = () => {
    authService.login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">
          Login to Your Account
        </h3>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleLogin}
              className="px-4 py-2 text-white bg-github hover:bg-github-dark rounded-lg transition-colors duration-300"
            >
              Login with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
