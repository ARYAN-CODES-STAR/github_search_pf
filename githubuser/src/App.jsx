"use client";
import { useState } from "react";
import axios from "axios";

const API_URL = "https://api.github.com/users/";

function App() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState("");

  const getUser = async (username) => {
    try {
      const { data } = await axios(API_URL + username);
      setUser(data);
      getRepos(username);
      setError("");
    } catch (error) {
      if (error.response.status === 404) {
        setError("No profile with this username");
        setUser(null);
        setRepos([]);
      }
    }
  };

  const getRepos = async (username) => {
    try {
      const { data } = await axios(API_URL + username + "/repos?sort=created");
      setRepos(data.slice(0, 5));
    } catch (error) {
      setError("Problem fetching repos");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value.trim();
    if (username) {
      getUser(username);
      e.target.elements.username.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <input
          type="text"
          name="username"
          placeholder="Search a GitHub User"
          className="w-full p-4 mb-8 text-white bg-green-500 rounded-lg shadow-lg placeholder-white"
        />
      </form>
      {error && (
        <div className="p-4 bg-purple-800 rounded-lg shadow-lg">
          <h1 className="text-2xl">{error}</h1>
        </div>
      )}
      {user && (
        <div className="flex flex-col items-center w-full max-w-2xl p-8 bg-green-800 rounded-lg shadow-lg lg:flex-row lg:items-start">
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-36 h-36 mb-4 border-8 border-yellow-500 rounded-full lg:mb-0"
          />
          <div className="lg:ml-8">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="mt-2 mb-4">{user.bio}</p>
            <ul className="flex flex-wrap justify-between max-w-md gap-4">
              <li className="flex items-center">
                <strong className="ml-2">{user.followers} Followers</strong>
              </li>
              <li className="flex items-center">
                <strong className="ml-2">{user.following} Following</strong>
              </li>
              <li className="flex items-center">
                <strong className="ml-2">{user.public_repos} Repos</strong>
              </li>
            </ul>
            <div className="mt-4">
              {repos.map((repo) => (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 mb-2 mr-2 text-sm font-semibold text-white bg-orange-600 rounded-lg"
                >
                  {repo.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
