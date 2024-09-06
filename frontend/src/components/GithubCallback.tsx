// src/components/GitHubCallback.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { authService } from "../services/authService";
import { setAuth } from "../store/slices/authSlice";

const GitHubCallback: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");

      if (code) {
        try {
          const { user, token } = await authService.handleCallback(code);
          console.log("Authenticated user:", user);
          console.log("Received token:", token);
          dispatch(setAuth({ user, token }));
          navigate("/dashboard");
        } catch (error) {
          console.error("Error during GitHub authentication:", error);
          setError(
            `Failed to authenticate with GitHub: ${(error as Error).message}`
          );
          setTimeout(() => navigate("/login"), 5000);
        }
      } else {
        setError(
          "No authorization code found in the URL. Please try logging in again."
        );
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [dispatch, location, navigate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return <div>Processing GitHub login...</div>;
};

export default GitHubCallback;
