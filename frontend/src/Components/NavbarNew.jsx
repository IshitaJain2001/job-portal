import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { logout } from "../toolkit/authSlice";
import "../Stylesheets/NavbarNew.css";

export default function NavbarNew() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showJobsDropdown, setShowJobsDropdown] = useState(false);
  const [showCompaniesDropdown, setShowCompaniesDropdown] = useState(false);

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    setIsProfileOpen(false);
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <div className="logo-text">JobHub</div>
          </Link>

          <div
            className="dropdown-wrapper"
            onMouseEnter={() => setShowJobsDropdown(true)}
            onMouseLeave={() => setShowJobsDropdown(false)}
          >
            <button className="nav-menu-btn">
              Jobs <FaChevronDown className="chevron-icon" />
            </button>

            {showJobsDropdown && (
              <div className="dropdown-menu">
                <p>
                  <Link to="/jobs/Technology">Technology</Link>
                </p>
                <p>
                  <Link to="/jobs/Marketing">Marketing</Link>
                </p>
                <p>
                  <Link to="/jobs/Sales">Sales</Link>
                </p>
                <p>
                  <Link to="/jobs/Finance">Finance</Link>
                </p>
              </div>
            )}
          </div>

          <div
            className="dropdown-wrapper"
            onMouseEnter={() => setShowCompaniesDropdown(true)}
            onMouseLeave={() => setShowCompaniesDropdown(false)}
          >
            <button className="nav-menu-btn">
              Companies <FaChevronDown className="chevron-icon" />
            </button>

            {showCompaniesDropdown && (
              <div className="dropdown-menu">
                <div onClick={() => navigate("/companies/top")}>
                  Top Companies
                </div>
                <div onClick={() => navigate("/companies/featured")}>
                  Featured Companies
                </div>
                <div onClick={() => navigate("/companies/startup")}>
                  Startups
                </div>
              </div>
            )}
          </div>
        </div>

        <form className="search-form" onSubmit={handleSearchSubmit}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search jobs by title, company, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-submit">
            <FaSearch style={{ fontSize: "16px" }} />
          </button>
        </form>

        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">{user?.name?.split(" ")[0]}</span>

              {user?.userType === "employer" && (
                <Link to="/employer-dashboard">
                  <button className="navbar-btn btn-primary">Dashboard</button>
                </Link>
              )}

              {user?.userType === "job_seeker" && (
                <Link to="/savedjobs">
                  <button className="navbar-btn btn-secondary">Saved</button>
                </Link>
              )}

              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="navbar-btn btn-menu"
              >
                ☰
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/register">
                <button className="navbar-btn btn-outline">Register</button>
              </Link>
              <Link to="/login">
                <button className="navbar-btn btn-primary">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {isProfileOpen && isLoggedIn && (
        <div className="profile-dropdown">
          <div className="profile-content">
            <p className="profile-name">{user?.name}</p>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-type-badge">
              <strong>Account Type:</strong>{" "}
              {user?.userType === "job_seeker" ? "Job Seeker" : "Employer"}
            </div>
            <hr className="profile-divider" />
            <button className="profile-menu-item logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
