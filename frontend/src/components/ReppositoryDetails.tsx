// src/components/RepositoryDetails.tsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchRepoIssues,
  fetchRepoPullRequests,
} from "../store/slices/githubSlice";

const RepositoryDetails: React.FC = () => {
  const { full_name } = useParams<{ full_name: string }>();
  const dispatch = useAppDispatch();
  const { currentRepository, issues, pullRequests, loading, error } =
    useAppSelector((state) => state.github);

  useEffect(() => {
    if (full_name) {
      const [owner, repo] = full_name.split("/");
      dispatch(fetchRepoIssues(owner, repo));
      dispatch(fetchRepoPullRequests(owner, repo));
    }
  }, [dispatch, full_name]);

  if (loading) {
    return <div className="text-center">Loading repository details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!currentRepository) {
    return <div className="text-center">Repository not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">{currentRepository.name}</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {currentRepository.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">Issues</h3>
          <ul className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {issues.slice(0, 5).map((issue) => (
              <li key={issue.id} className="px-4 py-3">
                <span className="font-medium">{issue.title}</span>
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    issue.state === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {issue.state}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Pull Requests</h3>
          <ul className="bg-white dark:bg-gray-800 shadow rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
            {pullRequests.slice(0, 5).map((pr) => (
              <li key={pr.id} className="px-4 py-3">
                <span className="font-medium">{pr.title}</span>
                <span
                  className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    pr.state === "open"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {pr.state}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RepositoryDetails;
