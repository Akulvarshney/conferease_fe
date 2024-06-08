"use client";
import Link from "next/link";
import React, { useEffect } from "react";

const Navbar = ({ pathName, router }) => {
  const notAllowedPath = ["/sign-up", "/login"];
  useEffect(() => {
    const token = localStorage?.getItem("token");

    if (token && notAllowedPath.includes(pathName)) {
      router.push("/dashboard");
    } else if (!token && !notAllowedPath.includes(pathName)) {
      router.push("/login");
    }
  }, [pathName, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <div className="navbar">
      {notAllowedPath.includes(pathName) || pathName === "/" ? (
        <div className="flex justify-between">
          <Link href="/">ConferEase</Link>
          <div className="flex gap-5">
            {pathName === "/" ? <Link href="/login">Login</Link> : null}
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <Link href="/">ConferEase</Link>
          <div className="flex gap-5">
            <Link href="/dashboard">Dashboard</Link>
            <p className=" cursor-pointer " onClick={() => handleLogout()}>
              Logout{" "}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
