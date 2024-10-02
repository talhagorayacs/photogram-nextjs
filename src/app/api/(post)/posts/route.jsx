import dbConnect from "@/lib/dbconnect";
import PostModel from "@/model/post.model";

export async function GET(request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit")) || 5; // Default to 5
  const offset = parseInt(url.searchParams.get("offset")) || 0; // Default to 0

  await dbConnect();

  try {
    const posts = await PostModel.find()
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1, _id: -1 }); // Sort by createdAt and _id for consistent ordering

    const totalPosts = await PostModel.countDocuments();
    const hasMorePosts = offset + limit < totalPosts;

    console.log("Posts fetched from DB:", posts); // Log the fetched posts

    return Response.json({
      success: true,
      posts,
      hasMorePosts, // Send the hasMorePosts flag
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      success: false,
      message: "Failed to load posts",
    }, { status: 500 });
  }
}
