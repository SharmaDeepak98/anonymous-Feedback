import dbConnect from "@/lib/dbConnect";
import simpleResponse from "@/lib/simpleResponse";
import UserModel from "@/model/User";
import { decode } from "punycode";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return simpleResponse(false, "user not found", 500);
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();

    return simpleResponse(true, "user is now verifies", 200);

    }else{
        return simpleResponse(false,"expired or incorrect verification code",500)
    }
  } catch (error) {
    return simpleResponse(false, "error verifying account", 500);
  }
}
