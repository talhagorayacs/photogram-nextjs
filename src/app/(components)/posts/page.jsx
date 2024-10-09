'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { MessageCircle, Send, MoreHorizontal, X } from "lucide-react";
import LikeButton from "./LikeButton";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RingLoader from 'react-spinners/RingLoader';

// Function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};
const Posts = () => {
  const router = useRouter()

  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [commentInput, setCommentInput] = useState({});
  const [commentsOverlay, setCommentsOverlay] = useState(null); // Track overlay for each post

  const { data: session } = useSession();
  const currentUserId = session?.user?._id || null; // Get current user ID from session

  const limit = 5;

  // Fetch posts from the API
  const fetchPosts = async () => {
    if (!hasMorePosts || isLoading) return;

    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts?limit=${limit}&offset=${offset}`);
      const data = await response.json();

      if (data.success) {
        setPosts((prevPosts) => [
          ...prevPosts,
          ...data.posts.filter((newPost) => !prevPosts.some((existingPost) => existingPost._id === newPost._id)),
        ]);
        setOffset((prevOffset) => prevOffset + limit);
        setHasMorePosts(data.hasMorePosts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const handleScroll = () => {
      if (hasMorePosts && !isLoading && window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMorePosts, isLoading]);

  // Handle like toggle
  const handleLikeToggle = (postId, newIsLiked) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? {
              ...post,
              isLiked: newIsLiked,
              likes: newIsLiked ? [...post.likes, { _id: currentUserId }] : post.likes.filter((like) => like._id !== currentUserId),
            }
          : post
      )
    );
  };

  // Handle comment submission
  const handleCommentSubmit = async (postId, comment) => {
    if (!comment) return;

    try {
      const response = await fetch(`/api/makecomment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, userId: currentUserId, comment }),
      });
      const data = await response.json();

      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: [...post.comments, data.newComment] }
              : post
          )
        );
        setCommentInput({ ...commentInput, [postId]: "" });
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  // Handle delete post
  const handleDeletePost = async (id) => {
    try {
      const response = await fetch('/api/deletepost', {
        method: "DELETE",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      }

    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await fetch('/api/deletecomment', {
        method: "DELETE",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({ postId, commentId })
      });

      const data = await response.json();
      if (data.success) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId
              ? { ...post, comments: post.comments.filter((comment) => comment._id !== commentId) }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle show comments overlay
  // const handleShowComments = (postId) => {
  //   setCommentsOverlay(postId);
  // };

  // Handle hide comments overlay
  // const handleHideComments = () => {
  //   setCommentsOverlay(null);
  // };
  // const router = useRouter();
  const navigateToProfile = (userId) =>{
    router.push(`/dashboard/${userId}`)
  }
  console.log(posts);
  
  return (
    <div className="space-y-4">
      <div>
         {/* Loader */}
      {isLoading && (
        <div className="loading-overlay">
          <RingLoader loading={isLoading} color="#36d7b7" size={150} />
        </div>
      )}
      <div className={isLoading ? 'blurred-background' : ''}></div>
      </div>
      {posts.map((post, index) => (
        <CardContainer key={`${post._id}-${index}`} className="inter-var perspective relative">
          <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[35rem] h-auto rounded-xl p-4 border">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4" >
                <Image
                  src={post.userId?.profilePhoto || "https://res.cloudinary.com/dswfyxkgj/image/upload/v1727820619/pexels-alecdoua-21837187.jpg.jpg"}
                  alt="User Profile"
                  height={60}
                  width={60}
                  className="rounded-full aspect-square object-cover"
                />
                <button onClick={()=>navigateToProfile(post.username)}>
                <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  {post.username}
                </p>
                </button>
                
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {formatTimestamp(post.createdAt)}
              </p>
            </div>

            {/* Dropdown Menu below the post header */}
            <div className="absolute top-4 right-4">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="w-5 h-5 text-neutral-500 cursor-pointer hover:text-neutral-800 transition duration-150" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Manage Post</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleDeletePost(post._id)}>Delete Post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Post Content */}
            <CardItem translateZ="50" className="mb-2 w-full">
              <p className="w-full h-full p-2 text-xs font-semibold text-neutral-600 dark:text-white bg-transparent border-none">
                {post.caption}
              </p>
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-2 overflow-hidden">
              <div className="transition-transform duration-300 ease-in-out transform group-hover/card:scale-105">
                <Image
                  src={post.photo || "https://res.cloudinary.com/dswfyxkgj/image/upload/v1727820619/pexels-alecdoua-21837187.jpg.jpg"}
                  height={1000}
                  width={1200}
                  className="h-64 w-full object-cover rounded-xl group-hover/card:shadow-xl transform group-hover/card:translate-z-10"
                  alt="thumbnail"
                />
              </div>
            </CardItem>

            {/* Post Actions */}
            <div className="flex justify-between items-center mt-4">
              <CardItem
                translateZ={20}
                as="button"
                className="flex items-center text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition duration-150"
                onClick={() => handleShowComments(post._id)}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>Comments</span>
              </CardItem>

              <LikeButton
                userId={currentUserId}
                postId={post._id}
                isLiked={Array.isArray(post.likes) ? post.likes.some((like) => like._id === currentUserId) : false}
                likesCount={Array.isArray(post.likes) ? post.likes.length : 0}
                onLikeToggle={handleLikeToggle}
                className={Array.isArray(post.likes) && post.likes.some((like) => like._id === currentUserId) ? "text-red-500" : "text-neutral-500"}
              />
            </div>

            {/* Comments Section */}
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10 relative max-h-24 overflow-y-auto">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment?._id} className="flex mt-1 flex-col w-full space-y-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-lg">
                    <div className="flex space-x-3 items-start w-full relative">
                      <Image
                        src={comment?.userId?.profilePhoto}
                        alt={`${comment?.userId?.username || "User"}'s profile`}
                        height={40}
                        width={40}
                        className="rounded-full aspect-square object-cover"
                      />
                      <div className="flex flex-col w-full">
                        <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                          {comment?.userId?.username || "User"}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {comment?.comment}
                        </p>
                        <p className="text-xs text-neutral-400 dark:text-neutral-500">
                          {formatTimestamp(comment?.createdAt)}
                        </p>
                      </div>
                      {/* Dropdown for Deleting Comment */}
                      <div className="absolute top-0 right-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <MoreHorizontal className="w-4 h-4 text-neutral-500 cursor-pointer hover:text-neutral-800 transition duration-150" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-36">
                            <DropdownMenuLabel>Manage Comment</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteComment(post._id, comment._id)}>Delete Comment</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 w-full text-center">No comments yet.</p>
              )}
            </div>

            {/* Add Comment Input */}
            <div className="flex mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput[post._id] || ""}
                onChange={(e) => setCommentInput({ ...commentInput, [post._id]: e.target.value })}
                className="border p-2 rounded-md w-full text-xs"
              />
              <button
                onClick={async () => {
                  const success = await handleCommentSubmit(post._id, commentInput[post._id]);
                  if (success) {
                    setCommentInput({ ...commentInput, [post._id]: "" });
                  }
                }}
                className="ml-2 px-4 py-1 bg-blue-600 text-white rounded-md text-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
};

export default Posts;