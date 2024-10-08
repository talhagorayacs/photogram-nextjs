import dbConnect from "@/lib/dbconnect";
import CommentModel from "@/model/comment.model";
import UserModel from "@/model/user.model"; // Import UserModel
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');

  if (!postId) {
    return NextResponse.json({
      success: false,
      message: "Post ID is required",
    }, { status: 400 });
  }

  try {
    await dbConnect();

    const comments = await CommentModel.find({ postId })
      .populate('userId'); // Ensure 'userId' is correct

    return NextResponse.json({
      success: true,
      message: "Comments loaded successfully",
      response: comments,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Unable to find comments",
      error: error.message || "An error occurred",
    }, { status: 500 });
  }
}
