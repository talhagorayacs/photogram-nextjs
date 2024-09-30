import mongoose, {Schema} from "mongoose";

const PostSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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


    const PostModel = (mongoose.model.Post) || (mongoose.model("Post" , PostSchema))

    export default PostModel