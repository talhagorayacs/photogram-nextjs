import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";

function FollowButton({ username, followerUserId, onFollowToggle }) {

  const [isFollowed, setIsFollowed] = useState(false);
  
  // Move useSelector out of useEffect
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("user from state", currentUser);
  }, [currentUser]);

  async function handleFollowClick() {
    if (!username) {
      console.error("No user ID found in session. Please login.");
      return;
    }

    try {
      const response = await fetch('/api/followers', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, followerUserId }),
      });

      const data = await response.json();
      console.log("Follow/unfollow action data", data);

      if (data.success) {
        // Determine new follow status
        const newIsFollowed = !data.message.includes("unfollowed");

        // Update local state
        setIsFollowed(newIsFollowed);

        // Call the onFollowToggle function (if needed to update parent state)
        if (onFollowToggle) {
          onFollowToggle(username, newIsFollowed);
        }
      } else {
        console.error("Error from API:", data.message);
      }
    } catch (error) {
      console.error("Error following/unfollowing the user:", error);
    }
  }

  return (
    <div className="mt-6 text-center">
      <button
        onClick={handleFollowClick}
        className={`${
          isFollowed ? "bg-gray-400" : "bg-blue-500"
        } text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300`}
      >
        <span>{isFollowed ? "Followed" : "Follow"}</span>
      </button>
    </div>
  );
}

export default FollowButton;
