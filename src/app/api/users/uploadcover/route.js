import dbConnect from "@/lib/dbconnect";
import { handleFileUpload } from "@/lib/uploadHandler";
import UserModel from "@/model/user.model";

export async function POST(request) {
  const formData = await request.formData();
  const username = formData.get("username");

  if (formData) {
    try {
      // Handle file upload
      const result = await handleFileUpload(formData);
      const photourl = result.secure_url;

      if (photourl) {
        try {
          // Connect to database
          await dbConnect();
          
          // Find the user by username
          const user = await UserModel.findOne({  username });
          
          if (!user) {
            return new Response(JSON.stringify({
              success: false,
              message: "User not found",
            }), { status: 404 });
          }

          // Update user's profile photo and description
          user.coverPhoto = photourl;
          await user.save();

          // Return success response
          return new Response(JSON.stringify({
            success: true,
            message: "cover photo updated successfully",
            photourl: photourl,
            username: user.username,
          }), { status: 200 });

        } catch (error) {
          console.error("Error updating the database:", error);

          return new Response(JSON.stringify({
            success: false,
            message: "Error updating the database",
          }), { status: 500 });
        }
      }

    } catch (error) {
      console.error("File upload error:", error);

      return new Response(JSON.stringify({
        success: false,
        message: "Error during file upload",
      }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({
    success: false,
    message: "No form data provided",
  }), { status: 400 });
}
