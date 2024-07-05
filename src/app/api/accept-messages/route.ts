import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import simpleResponse from "@/lib/simpleResponse";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return simpleResponse(false, "Not Authenticated", 401);
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return simpleResponse(
        false,
        "failed to update user status of recieving messages",
        401
      );
    }
    return simpleResponse(
      true,
      "successfully updated the user status of recieving message",
      201
    );
  } catch (error) {
    console.log("failed to update user's status to accept message ");
    return simpleResponse(
      false,
      "failed to update user's status to accept message ",
      500
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return simpleResponse(false, "Not Authenticated", 401);
  }

  try {
    const foundUser = await UserModel.findById(user._id);

    if (!foundUser) {
      return simpleResponse(false, "user not found accept-message", 400);
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    return simpleResponse(
      false,
      "error occoured while reciveing message accepting status ",
      401
    );
  }
}
