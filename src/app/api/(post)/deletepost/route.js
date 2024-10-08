import dbConnect from "@/lib/dbconnect";
import PostModel from "@/model/post.model";

// DELETE post API
export async function DELETE(req) {
    // Extract the ID from the request body
    const { id } = await req.json(); // Use await req.json() to get the body

    if (!id) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "ID not found",
            }),
            { status: 404, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        await dbConnect(); // Connect to MongoDB

        // Find and delete the post by ID
        const post = await PostModel.findByIdAndDelete(id);

        if (!post) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Post not found",
                }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                message: "Post deleted successfully",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error deleting post from backend:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Server error",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
