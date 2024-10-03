// app/api/users/[username]/route.js
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";

export async function GET(req, { params }) {
  // Check if params is provided
  if (!params || !params.username) {
    return new Response(
      JSON.stringify({ success: false, message: "Username not provided" }),
      { status: 400 }
    );
  }

  const { username } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    const user = await UserModel.findOne({ username });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: user }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
