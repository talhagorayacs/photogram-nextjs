import mongoose, { Schema } from "mongoose";

const followerSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followerUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    isFollowed: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

const FollowerModel = mongoose.models.Follower || mongoose.model("Follower", followerSchema);

export default FollowerModel;
