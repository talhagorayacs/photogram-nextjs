import dbConnect from "@/lib/dbconnect";
import LikeModel from "@/model/like.model";
import PostModel from "@/model/post.model";
import UserModel from "@/model/user.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse the request body to extract userId and postId
    const { userId, postId } = await req.json();

    // Validate input
    if (!userId || !postId) {
      return NextResponse.json({
        success: false,
        message: "User ID and Post ID are required",
      }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Check if the user already liked the post
    const existingLike = await LikeModel.findOne({ userId, postId });

    let responseMessage;

    if (existingLike) {
      // If the like already exists, toggle the isLiked field
      existingLike.isLiked = !existingLike.isLiked;
      await existingLike.save();

      if (!existingLike.isLiked) {
        // If the post is unliked, remove it from the user's likedPosts array
        await UserModel.findByIdAndUpdate(userId, {
          $pull: { likedPosts: postId }
        });

        // Remove the userId from the likes array of the post
        await PostModel.findByIdAndUpdate(postId, {
          $pull: { likes: userId }
        });

        // Remove the like document from the LikeModel collection
        await LikeModel.deleteOne({ userId, postId });

        responseMessage = "Post unliked successfully and like removed";
      } else {
        // If the post is liked, add it to the user's likedPosts array
        await UserModel.findByIdAndUpdate(userId, {
          $addToSet: { likedPosts: postId }
        });

        // Add the userId to the likes array of the post
        await PostModel.findByIdAndUpdate(postId, {
          $addToSet: { likes: userId }
        });

        responseMessage = "Post liked successfully";
      }
    } else {
      // If no like document exists, create a new one
      const newLike = new LikeModel({ userId, postId, isLiked: true });
      await newLike.save();

      // Add postId to the user's likedPosts array
      await UserModel.findByIdAndUpdate(userId, {
        $addToSet: { likedPosts: postId }
      });

      // Add the userId to the likes array of the post
      await PostModel.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId }
      });

      responseMessage = "Post liked successfully";
    }

    // Return a success response
    return NextResponse.json({
      success: true,
      message: responseMessage,
    }, { status: 200 });
  } catch (error) {
    // Handle errors during the request
    return NextResponse.json({
      success: false,
      message: "Unable to like/unlike post",
      error: error.message || "An error occurred",
    }, { status: 500 });
  }
}
