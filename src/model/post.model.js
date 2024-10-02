import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String, // Change this to String to store the username directly
        required: true
    },
    caption: {
        type: String,
        required: false
    },
    photo: {
        type: String, // URL or path to the photo
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

// Check if the model already exists
const PostModel = mongoose.models.Post || mongoose.model("Post", PostSchema);

export default PostModel;
