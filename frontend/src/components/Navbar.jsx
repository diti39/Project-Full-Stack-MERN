import React from "react";
import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { removeToken } from "../lib/auth";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            <h1 className="text-2xl font-bold">ThinkBoard</h1>
          </Link>
          <div className="flex items-center justify-between">
            <Link className="btn btn-ghost" to="/create">
              <PlusIcon className="size-4" />
              <span>Create new note</span>
            </Link>
          </div>
          <button onClick={handleLogout} className="btn btn-ghost">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
