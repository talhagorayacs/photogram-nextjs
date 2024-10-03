// app/api/userposts/[userId]/route.js

import dbConnect from "@/lib/dbconnect";
import PostModel from "@/model/post.model";

export async function GET(request, { params }) {
  const { userId } = params; // Get userId from the route parameters

  await dbConnect();

  try {
    const posts = await PostModel.find({ userId }).sort({ createdAt: -1 });

    if (!posts.length) {
      return new Response(JSON.stringify({ message: "No posts found for this user." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ posts }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
