import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

const SearchBar = ({ onSearch, results }) => {
  const router = useRouter();
  const [showResults, setShowResults] = useState(true);

  const placeholders = [
    "What's the first rule of Fight Club?",
    "Who is Tyler Durden?",
    "Where is Andrew Laeddis Hiding?",
    "Write a Javascript method to reverse a string",
    "How to assemble your own PC?",
  ];

  const handleChange = (e) => {
    onSearch(e.target.value); 
    setShowResults(true); 
  };

  const handleUserClick = (username) => {
    setShowResults(false); 
    router.push(`/dashboard/${username}`); 
  };

  return (
    <div className="relative flex flex-col justify-center items-center px-4">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
      />

      {/* Display the fetched user data if available */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full max-w-md bg-white text-black rounded-lg shadow-lg overflow-hidden z-50">
          <ul className="list-none">
            {results.map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user.username)}
                className="cursor-pointer p-2 hover:bg-gray-200"
              >
                {user.username}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;