import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";
import simpleResponse from "@/lib/simpleResponse";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return simpleResponse(false, "User not found", 404);
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessage) {
      return simpleResponse(false, "User is not accepting messages", 403);
    }

    const newMessage = { content, createdAt: new Date() };

    // Push the new message to the user's messages array
    user.messages.push(newMessage as Message);
    await user.save();

    return simpleResponse(true, "message sent successfully", 201);
  } catch (error) {
    console.error("Error adding message:", error);
    return simpleResponse(false, "internal server error", 500);
  }
}
