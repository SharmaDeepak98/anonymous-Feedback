import UserModel from "@/model/User";
import { User } from "next-auth";
import simpleResponse from "@/lib/simpleResponse";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  console.log('deleting message',messageId)
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return simpleResponse(false, "not authenticated", 401);
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return simpleResponse(false, "Message not found or already deleted", 404);
    }

    return simpleResponse(true, "Message deleted", 200);
  } catch (error) {
    console.error("Error deleting message:", error);
    return simpleResponse(false, "Error deleting message", 500);
  }
}
