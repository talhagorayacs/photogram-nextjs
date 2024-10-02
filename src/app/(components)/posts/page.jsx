"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea"; 
import { MessageCircle, Heart } from "lucide-react";

// Function to format the timestamp
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' });
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 5;

  const fetchPosts = async () => {
    if (!hasMorePosts || isLoading) return;

    setIsLoading(true);

    const response = await fetch(`/api/posts?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    if (data.success) {
      setPosts((prevPosts) => {
        const newPosts = data.posts.filter(
          (newPost) =>
            !prevPosts.some((existingPost) => existingPost._id === newPost._id)
        );

        return [...prevPosts, ...newPosts];
      });
      setOffset((prevOffset) => prevOffset + limit);
      setHasMorePosts(data.hasMorePosts);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    const handleScroll = () => {
      if (
        hasMorePosts &&
        !isLoading &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMorePosts, isLoading]);

  return (
    <>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={`${post._id}-${index}`}>
            <CardContainer className="inter-var perspective">
              {/* Increased card height */}
              <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[35rem] h-auto sm:h-[45rem] rounded-xl p-4 border">  
                {/* User Profile and Timestamp at the top of the card */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* User Profile Photo */}
                    <Image
                      src="https://randomuser.me/api/portraits/women/44.jpg" // Example profile photo URL of post author
                      alt="User Profile"
                      height={40}
                      width={40}
                      className="rounded-full"
                    />
                    <div>
                      {/* Username */}
                      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{post.username}</p>
                    </div>
                  </div>
                  {/* Post Timestamp */}
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatTimestamp(post.createdAt)}
                  </p>
                </div>

                {/* Post Caption */}
                <CardItem translateZ="50" className="mb-2 w-full">
                  <Textarea
                    placeholder={post.caption}
                    className="w-full h-full p-2 text-xs font-semibold text-neutral-600 dark:text-white bg-transparent border-none focus:outline-none resize-none"
                    rows={2}
                    style={{ overflow: "hidden" }}
                    disabled
                  />
                </CardItem>

                {/* Post Image */}
                <CardItem translateZ="100" className="w-full mt-2 overflow-hidden">
                  <div className="transition-transform duration-300 ease-in-out transform group-hover/card:scale-105">
                    <Image
                      src={post.photo}
                      height={1000}  
                      width={1200}   
                      className="h-96 w-full object-cover rounded-xl group-hover/card:shadow-xl transform group-hover/card:translate-z-10"
                      alt="thumbnail"
                    />
                  </div>
                </CardItem>

                {/* Like and Comment Icons */}
                <div className="flex justify-between items-center mt-6">
                  <CardItem
                    translateZ={20}
                    as={Link}
                    href="#"
                    className="flex items-center text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition duration-150"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span>Comments</span>
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="flex items-center text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition duration-150"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    <span>Like</span>
                  </CardItem>
                </div>

                {/* User Comment Section */}
                <div className="mt-6 flex items-start space-x-4">
                  {/* User Profile Photo for comment */}
                  <Image
                    src="https://randomuser.me/api/portraits/men/32.jpg" // Example profile photo URL of commenter
                    alt="User Profile"
                    height={40}
                    width={40}
                    className="rounded-full"
                  />
                  <div>
                    {/* Username of commenter */}
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">User123</p>
                    {/* User Comment */}
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      "This is an amazing post! I really enjoyed the content."
                    </p>
                  </div>
                </div>

              </CardBody>
            </CardContainer>
          </div>
        ))}
      </div>
    </>
  );
};

export default Posts;
