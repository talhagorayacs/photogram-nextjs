"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/store/authSlice";
import SearchBar from "./SearchBar";
// import FloatingDock from "./Dock";

function Navbar() {
  const { data: session } = useSession();
  const dispatch = useDispatch();
 
  useEffect(() => {
    if (session) {
      dispatch(setUser({ userInfo: session.user }));
      console.log("Session in Navbar:", session);
    } else {
      console.log("No session found");
    }
  }, [session, dispatch]);

  const userInfo = useSelector((state) => state.auth.userInfo);
  console.log("I am user info from store", userInfo);

  // Search bar logic
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState([]); // Store user data from the API

  const handleSearch = async (input) => {
    setUsername(input); // Update username state
    if (input) {
      // Check if input has a value
      try {
        const response = await fetch(`/api/users/searchuser?username=${input}`);
        const data = await response.json();
        console.log(data); // Log the response data
        if (data.success) {
          setUserData(data.usersData); // Store the user data in state
        }
      } catch (error) {
        console.error("Error fetching users:", error); // Handle any errors
      }
    } else {
      setUserData([]); // Clear results if input is empty
    }
  };
  if (!session) {
    return null; // Do not render the dock if the user is not logged in
  }
  return (
    <>
      <nav className="p-2 md:p-4 shadow-md bg-gradient-to-r from-gray-100 via-gray-200 to-purple-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 text-white relative">
        {/* Search Bar */}
        <div className="mt-1">
          <SearchBar onSearch={handleSearch} results={userData} />
        </div>
      </nav>
      <footer>
        {/* <FloatingDock /> */}
      </footer>
    </>
  );
}

export default Navbar;
