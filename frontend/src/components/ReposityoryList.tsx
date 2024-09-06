// src/components/RepositoryList.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchUserRepos,
  setCurrentRepository,
} from "../store/slices/githubSlice";
import { Link } from "react-router-dom";

const RepositoryList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { repositories, loading, error } = useAppSelector(
    (state) => state.github
  );

  useEffect(() => {
    dispatch(fetchUserRepos());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center">Loading repositories...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Your Repositories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repositories.map((repo) => (
          <Link
            key={repo.id}
            to={`/repository/${repo.full_name}`}
            className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-200"
            onClick={() => dispatch(setCurrentRepository(repo))}
          >
            <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {repo.description}
            </p>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>⭐ {repo.stargazers_count}</span>
              <span>🍴 {repo.forks_count}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RepositoryList;
