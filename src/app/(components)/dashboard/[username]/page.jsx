"use client";
import { setUser } from "@/store/authSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FocusCards } from "@/components/ui/focus-cards";
import FollowButton from "./followers";

const Profile = ({ params = {} }) => {
  const { username = "" } = params; // Default value for username
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      if (username) {
        try {
          const trimmedUsername = username.trim();
          const response = await fetch(`/api/users/${trimmedUsername}`);

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          const finaldata = data.data;

          setUserData(finaldata);
          dispatch(setUser({ userInfo: finaldata, userData: finaldata }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [username, dispatch]);

  useEffect(() => {
    console.log(userData, "this is data");
  }, [userData]);

  // Corrected from `userData?.post` to `userData?.posts`
  const cards = userData?.posts?.map((post) => ({
    title: post.caption,
    src: post.photo,
  }));

  if (!userData) {
    return <div>Loading...</div>; // Replace with a spinner for better UX
  }

  return (
    <div className="relative">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg">
        <div className="relative h-48 w-full bg-gray-800">
          <Image
            src="https://images.pexels.com/photos/28435066/pexels-photo-28435066/free-photo-of-ancient-lycian-rock-tombs-in-dalyan-turkiye.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            alt="Cover Photo"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>

        <div className="p-6">
          <div className="relative w-24 h-24 mx-auto -mt-12 rounded-full border-4 border-white overflow-hidden">
            <Image
              src={
                userData?.profilePhoto ||
                "https://images.pexels.com/photos/28435066/pexels-photo-28435066/free-photo-of-ancient-lycian-rock-tombs-in-dalyan-turkiye.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
              }
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
            />
          </div>

          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">{userData?.username}</h2>
            <p className="text-gray-600">
              {userData?.description || "No bio available."}
            </p>
          </div>

          <div className="mt-6 flex justify-around text-center">
            <div>
              <p className="text-xl font-semibold">
                {userData?.followers?.length || 0}
              </p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {userData?.following?.length || 0}
              </p>
              <p className="text-gray-600">Following</p>
            </div>
            <div>
              <p className="text-xl font-semibold">
                {userData?.posts?.length || 0}
              </p>
              <p className="text-gray-600">Posts</p>
            </div>
          </div>
          <FollowButton
            username={username}
            followerUserId={userData._id} // Add valid followerUserId
          />
        </div>
      </div>

      <div className="mt-6">
        <FocusCards cards={cards} />
      </div>
    </div>
  );
};

export default Profile;
