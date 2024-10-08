import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";

// Search all the users through the search bar
export async function GET(req) {
    // Extract username from the URL query parameters
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username"); // Get the username from the query parameters

    if (!username) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "Username not provided",
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        await dbConnect(); // Connect to MongoDB

        // Use a regular expression to find users with matching usernames
        const users = await UserModel.find({
            username: { $regex: username, $options: "i" } // Case-insensitive search
        });

        if (users.length === 0) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message: "No users found",
                    usersData: [],
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                usersData: users,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error fetching users:", error); // Log the error for debugging
        return new Response(
            JSON.stringify({
                success: false,
                message: "Unable to find users",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
