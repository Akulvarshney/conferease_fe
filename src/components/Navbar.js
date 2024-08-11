import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathName = location.pathname;

  const notAllowedPath = ["/sign-up", "/login"];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <div>
      {notAllowedPath.includes(pathName) || pathName === "/" ? (
        <div className="navbar">
          <Link to="/">ConferEase</Link>
          <div className="">
            {pathName === "/" ? <Link to="/login">Login</Link> : null}
          </div>
        </div>
      ) : (
        <div className="navbar">
          <Link to="/">ConferEase</Link>
          <div className="navbar_options">
            <Link to="/dashboard">Dashboard</Link>
            <p className="cursor-pointer" onClick={handleLogout}>
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
