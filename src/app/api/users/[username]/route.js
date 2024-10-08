import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import PostModel from "@/model/post.model";
export async function GET(req, { params }) {
  if (!params || !params.username) {
    return new Response(
      JSON.stringify({ success: false, message: "Username not provided" }),
      { status: 400 }
    );
  }

  const { username } = params;

  try {
    await dbConnect(); // Connect to MongoDB

    // Fetch the user and populate their post references with full data
    const user = await UserModel.findOne({ username }).populate('posts');

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
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      { status: 500 }
    );
  }
}
