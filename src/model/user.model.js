import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        post: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
        verifyCode: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        codeExpiry: {  // Change this to Date
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
