import CommentModel from "@/model/comment.model";
import dbConnect from "@/lib/dbconnect";
import PostModel from "@/model/post.model";
import { NextResponse } from "next/server";

export async function POST(req) {
    // Parse the request body
    const { userId, postId, comment } = await req.json(); // Add 'await' here

    // Check for missing fields
    if (!userId || !postId || !comment) {
        return NextResponse.json({
            success: false,
            message: "All fields are required."
        }, { status: 400 }); // Use 400 for bad request
    }

    try {
        await dbConnect(); // Ensure the database connection

        // Create a new comment
        const newComment = new CommentModel({
            userId: userId,
            postId: postId,
            comment: comment // Ensure this matches your schema
        });

        // Save the comment to the database
        await newComment.save();

        // Optionally, push the comment ID to the post document
        await PostModel.findByIdAndUpdate(postId, {
            $push: { comments: newComment._id } // Adjust based on your schema
        });

        // Return success response
        return NextResponse.json({
            success: true,
            message: "Comment created successfully."
        }, { status: 201 }); // Use 201 for created
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message // Return the error message
        }, { status: 500 }); // Use 500 for server error
    }
}
