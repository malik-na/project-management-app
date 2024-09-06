// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import RepositoryList from "./components/ReposityoryList";
import RepositoryDetails from "./components/ReppositoryDetails";
import GitHubCallback from "./components/GithubCallback";
import { useAppSelector } from "./hooks/redux";

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({
  element,
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />
            <Route
              path="/repositories"
              element={<PrivateRoute element={<RepositoryList />} />}
            />
            <Route
              path="/repository/:full_name"
              element={<PrivateRoute element={<RepositoryDetails />} />}
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
};

export default App;
