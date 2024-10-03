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
        profilePhoto:{
            type:String,
            default:"https://images.pexels.com/photos/28607741/pexels-photo-28607741/free-photo-of-traditional-korean-architecture-in-idyllic-seoul-setting.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        },
        description:{
            type:String,
            default:"I am default description"
        },
        coverPhoto:{
            type:String,
            default:"https://images.pexels.com/photos/28305233/pexels-photo-28305233/free-photo-of-a-beach-with-umbrellas-and-boats-in-the-distance.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        }
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
