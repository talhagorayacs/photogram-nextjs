import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";
import FollowerModel from "@/model/follower.model";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { username, followerUserId } = await req.json();

  if (!username || !followerUserId) {
    return NextResponse.json(
      {
        success: false,
        message: "Username and Follower User ID are required",
      },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const user = await UserModel.findOne({ username });
    const followerUser = await UserModel.findById(followerUserId);

    if (!user || !followerUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User or Follower User ID not found",
        },
        { status: 404 }
      );
    }

    const userId = user._id;
    // Removed duplicate declaration of followerUserId

    const existingFollower = await FollowerModel.findOne({
      userId,
      followerUserId,
    });
    let responseMessage;

    if (existingFollower) {
      existingFollower.isFollowed = !existingFollower.isFollowed;
      await existingFollower.save();

      if (!existingFollower.isFollowed) {
        await UserModel.findOneAndUpdate(
          { username },
          {
            $pull: { followers: followerUserId },
          }
        );
        await FollowerModel.deleteOne({ userId, followerUserId });
        responseMessage = "User unfollowed successfully";
      } else {
        responseMessage = "User followed successfully";
      }
    } else {
      await UserModel.findOneAndUpdate(
        { username },
        {
          $addToSet: { followers: followerUserId },
        }
      );

      await FollowerModel.create({
        userId: userId,
        followerUserId: followerUserId,
        isFollowed: true,
      });

      responseMessage = "User followed successfully";
    }

    return NextResponse.json({
      success: true,
      message: responseMessage,
      data: responseMessage,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 400 }
    );
  }
}