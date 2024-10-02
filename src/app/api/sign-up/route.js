import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/resend";

export async function POST(request) {
    await dbConnect();

    try {
        // Await the JSON body
        const { username, email, password } = await request.json(); 

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username already taken",
                },
                { status: 400 }
            );
        }

        const existingUserVerifiedByEmail = await UserModel.findOne({ email });
        const verificationCode = Math.floor(100000 + Math.random() * 999999);

        if (existingUserVerifiedByEmail) {
            if (existingUserVerifiedByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: "Email already taken by some other user",
                    },
                    { status: 400 }
                );
            } else {
                existingUserVerifiedByEmail.password = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.verifyCode = verificationCode;
                existingUserVerifiedByEmail.codeExpiry = new Date(Date.now() + 3600000);
                await existingUserVerifiedByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                followers: [],
                following: [],
                post: [],
                verifyCode: verificationCode,
                isVerified: false,
                codeExpiry: expiryDate,
            });
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, username, verificationCode); // Await the email response
        console.log(emailResponse,"response from sign up resend email");
        
        if (!emailResponse) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email.",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: true,
                    message: "User registered successfully.",
                },
                { status: 200 }
            );
        }

    } catch (error) {
        console.error("Error registering new user:", error);

        return Response.json(
            {
                success: false,
                message: "Error registering the user.",
                error: error.message || "Unknown error", // Provide a more user-friendly error message
            },
            { status: 500 } // Change to 500 for server error
        );
    }
}
