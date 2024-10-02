import dbConnect from '../../../lib/dbconnect';
import UserModel from '../../../model/user.model';

export async function POST(request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username); // Keep this if you need it for some reason

        // Querying directly by username
        const user = await UserModel.findOne({ username });
        console.log('Decoded Username:', decodedUsername);
        console.log('Querying for user with username:', username);
        console.log('Found User:', user);

        if (!user) {
            return Response.json({
                success: false,
                message: "username does not exist"
            }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === code;
        const codeValidity = new Date(user.codeExpiry) > new Date();

        if (isCodeValid && codeValidity) {
            user.isVerified = true;
            await user.save();

            return Response.json({
                success: true,
                message: "user Verified Successfully"
            }, { status: 200 });
        } else if (!codeValidity) {
            return Response.json({
                success: false,
                message: "code Expired"
            }, { status: 400 });
        } else {
            return Response.json({
                success: false,
                message: "invalid code"
            }, { status: 400 });
        }

    } catch (error) {
        console.error("error verifying user", error);

        return Response.json({
            success: false,
            message: "error verifying user"
        }, { status: 400 });
    }
}
