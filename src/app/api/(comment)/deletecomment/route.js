import dbConnect from "@/lib/dbconnect";
import CommentModel from "@/model/comment.model";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    // Parse the request body to extract commentId
    const { commentId } = await req.json();

    // Validate commentId presence
    if (!commentId) {
      return NextResponse.json({
        success: false,
        message: "Comment ID is required",
      }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Delete the comment based on commentId
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    // Check if the comment was deleted successfully
    if (!deletedComment) {
      return NextResponse.json({
        success: false,
        message: "Comment not found or already deleted",
      }, { status: 404 });
    }

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Comment deleted successfully",
      response: deletedComment
    }, { status: 200 });
  } catch (error) {
    // Handle errors during the request
    return NextResponse.json({
      success: false,
      message: "Unable to delete comment",
      error: error.message || "An error occurred",
    }, { status: 500 });
  }
}
