import dbConnect from "@/lib/dbconnect";
import PostModel from "@/model/post.model";
import CommentModel from "@/model/comment.model"; // Import your comment model
import UserModel from "@/model/user.model"; // Import User model

export async function GET(request) {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit")) || 5; // Default to 5
    const offset = parseInt(url.searchParams.get("offset")) || 0; // Default to 0

    await dbConnect();

    try {
        const posts = await PostModel.find()
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1, _id: -1 })
            .populate({
                path: 'comments',
                populate: {
                    path: 'userId', // Populate userId in comments to get user details
                    model: UserModel,
                    select: 'username profilePhoto' // Only retrieve username and profile photo for user
                }
            })
            .populate({
                path: 'likes', // Populate likes field
                model: UserModel, // Populate the likes array with user details
                select: 'username profilePhoto' // Only retrieve username and profile photo for likes
            });

        const totalPosts = await PostModel.countDocuments();
        const hasMorePosts = offset + limit < totalPosts;

        return new Response(JSON.stringify({
            success: true,
            posts,
            hasMorePosts,
        }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({
            success: false,
            message: "Failed to load posts",
            error: error.message
        }), { status: 500 });
    }
}
