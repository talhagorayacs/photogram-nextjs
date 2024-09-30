import dbConnect from '../../../lib/dbconnect';
import UserModel from '../../../model/user.model';
import { z } from 'zod';
import { userNameUnique } from '../../../Schema/signUpSchema';

const UsernameQuerySchema = z.object({
    username: userNameUnique,
});

export async function GET(request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: { username: searchParams.get('username') }, // Wrap in an object
        };

        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                    message2: result.error,
                },
                { status: 400 }
            );
        }

        const { username } = result.data.username; // Accessing username correctly

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}
