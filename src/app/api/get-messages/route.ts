import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import simpleResponse from "@/lib/simpleResponse";
import UserModel from "@/model/User";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const authenticatedUser: User = session?.user as User;

  if (!session || !session.user) {
    return simpleResponse(false, "not authenticated", 401);
  }
  const userId = new mongoose.Types.ObjectId(authenticatedUser._id);

  try {

    const user = await UserModel.exists({_id:userId})
if (!user) {

      return simpleResponse(false, "user not found", 401);
  
}


    const userMessages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!userMessages.length) {
      return simpleResponse(false, "Your Message Box is empty", 401);
    }

    return Response.json(
      {
        success: true,
        messages: userMessages[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("an unexpected error occoured");
    return simpleResponse(false, "could not get messages", 500);
  }
}
