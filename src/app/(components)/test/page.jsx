'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession, signOut } from "next-auth/react";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const user = session?.user;
  console.log("user data  from test",user);

  
  // Get userData from the Redux store
  const userData = useSelector((state) => state.auth.userData);
  
  // Check if userData exists and destructure userId safely
  const userId = user?._id 
  console.log(userId);
  

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("Fetching posts for user ID:", userId);
      
      if (!userId) {
        setLoading(false); // Stop loading if userId is not available
        return;
      }

      try {
        const response = await fetch(`/api/userposts/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>; // You could replace this with a spinner or skeleton loader
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>User Posts</h2>
      {posts.length === 0 ? (
        <p>No posts found for this user.</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h3>{post.caption}</h3>
              <img 
                src={post.photo} 
                alt={post.caption} 
                style={{ width: '100%', height: 'auto' }} 
              />
              <p>Posted on: {new Date(post.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPosts;
