"use client";

import { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useSession } from "next-auth/react";

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setUserId(user._id);
    } else {
      console.log("No session found");
    }
  }, [user]);

  const handleFileChange = (newFiles) => {
    if (newFiles.length > 0) {
      setFile(newFiles[0]);
      console.log("file loaded");
    } else {
      console.log("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      console.log("No file selected");
      return; // Prevent submission if no file is selected
    }
    
    setLoading(true); // Start loading
    const formData = new FormData();
    formData.append("file", file);
    formData.append("username", username);
    formData.append("caption", caption);
    formData.append("id", userId);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log(response,"response from frontend");
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      const data = await response.json();
      console.log(data);
      // Reset form or show success message here if needed
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  if (!user) {
    return <div>Please log in to upload files.</div>; // User feedback for authentication
  }

  return (
    <div className="w-full max-w-4xl mx-auto min-h-96 border border-dashed bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-lg">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mt-4">
          <label
            htmlFor="caption"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Caption
          </label>
          <input
            type="text"
            id="caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md w-full"
            placeholder="Enter a caption"
          />
        </div>
        <div className="mt-4">
          <FileUpload
            onChange={handleFileChange}
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <button
          type="submit"
          className={`mt-4 px-4 py-2 ${loading ? 'bg-gray-400' : 'bg-blue-600'} text-white rounded-md hover:bg-blue-700`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadPage;
