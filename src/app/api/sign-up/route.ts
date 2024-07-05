import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import simpleResponse from "@/lib/simpleResponse";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    console.log(username, email, password);
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    const existingUserByEmail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 3600000);

    if (existingUserVerifiedByUsername) {
      return simpleResponse(false, "username already taken", 409);
    }
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return simpleResponse(false, "user already exist by this email", 409);
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.username = username;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = expiryDate;

        existingUserByEmail.save();
      }
    } else {
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        isVerified: false,
        messages: [],
      });
      await newUser.save();

      //send verificaion email
      const emailResponse = await SendVerificationEmail(
        email,
        username,
        verifyCode
      );
      return simpleResponse(true, "successfully added user in database", 200);
    }
  } catch (err) {
    return simpleResponse(false, "error registering accounting", 500);
  }
}
