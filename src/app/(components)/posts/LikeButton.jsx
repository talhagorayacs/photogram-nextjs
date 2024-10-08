import React from "react";
import { Heart } from "lucide-react";

// LikeButton component
const LikeButton = ({ userId, postId, isLiked, onLikeToggle, likesCount }) => {
  const handleLikeClick = async () => {
    if (!userId) {
      console.error("No user ID found in session. Please login.");
      return;
    }

    try {
      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, postId }),
      });

      const data = await response.json();
      console.log("liked post data", data);

      if (data.success) {
        // Update the like state based on the API response
        const newIsLiked = !data.message.includes("unliked");
        onLikeToggle(postId, newIsLiked); // Pass the updated like status
      } else {
        console.error("Error from API:", data.message);
      }
    } catch (error) {
      console.error("Error liking/unliking the post:", error);
    }
  };

  return (
    <button
      className={`flex items-center transition duration-150 ${isLiked ? 'text-red-500' : 'text-neutral-500'}`}  // Change to red if liked
      onClick={handleLikeClick}
    >
      <Heart className="w-5 h-5 mr-2" fill={isLiked ? 'currentColor' : 'none'} />
      <span>{likesCount} {isLiked ? "Liked" : "Like"}</span>  {/* Display like count */}
    </button>
  );
};

export default LikeButton;