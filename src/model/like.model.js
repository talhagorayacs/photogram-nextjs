import mongoose, { Schema } from 'mongoose';

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
  },
  isLiked: {
    type: Boolean,
    default: true, // Set default to true since a like action should set this to true
  }
}, { timestamps: true });

const LikeModel = mongoose.models.Like || mongoose.model("Like", LikeSchema);

export default LikeModel;
