"use client";
import { setUser } from "@/store/authSlice";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = ({ params }) => {
  const { username } = params; // Extracting username from params
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
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
          console.log("final data", finaldata);
          
          // Updating local state
          setUserData(finaldata);
          // Dispatching to Redux store
          dispatch(setUser({ userData: finaldata }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [username, dispatch]); // Include dispatch in the dependency array

  // Log userData whenever it changes
  useEffect(() => {
    console.log(userData, "this is data");
  }, [userData]);

  if (!userData) {
    return <div>Loading...</div>; // Loading state while fetching data
  }

  return (
    <div className="relative">
      {/* Profile Component */}
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg">
        {/* Cover Photo */}
        <div className="relative h-48 w-full bg-gray-800">
          <Image
            src="https://images.pexels.com/photos/28435066/pexels-photo-28435066/free-photo-of-ancient-lycian-rock-tombs-in-dalyan-turkiye.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
            alt="Cover Photo"
            layout="fill"
            objectFit="cover"
            className="rounded-t-lg"
          />
        </div>

        {/* Profile Section */}
        <div className="p-6">
          {/* Profile Picture */}
          <div
            className="relative w-24 h-24 mx-auto -mt-12 rounded-full border-4 border-white overflow-hidden cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open the modal when profile picture is clicked
          >
            <Image
              src={userData.profilePhoto || "https://images.pexels.com/photos/28435066/pexels-photo-28435066/free-photo-of-ancient-lycian-rock-tombs-in-dalyan-turkiye.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"}
              alt="Profile Picture"
              layout="fill"
              objectFit="cover"
            />
          </div>

          {/* Username and Description */}
          <div className="text-center mt-4">
            <h2 className="text-2xl font-bold">{userData.username}</h2>
            <p className="text-gray-600">
              {userData.description || "No bio available."}
            </p>
          </div>

          {/* Follow Info */}
          <div className="mt-6 flex justify-around text-center">
            <div>
              <p className="text-xl font-semibold">{userData.followers?.length || 0}</p>
              <p className="text-gray-600">Followers</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{userData.following?.length || 0}</p>
              <p className="text-gray-600">Following</p>
            </div>
            <div>
              <p className="text-xl font-semibold">{userData.post?.length || 0}</p>
              <p className="text-gray-600">Posts</p>
            </div>
          </div>

          {/* Follow Button */}
          <div className="mt-6 text-center">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
              Follow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
