import mongoose,{Schema} from 'mongoose'

const LikeSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  }
}, { timestamps: true });

const LikeModel = (mongoose.model.Like) || mongoose.model("Like" , LikeSchema)

export default LikeModel;
