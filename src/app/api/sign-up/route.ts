import { SendVerificationEmail } from "@/helpers/SendVerificationEmail";
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import simpleResponse from "@/lib/simpleResponse";

export async function POST(request: Request) {
  console.log("run");
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

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

      return simpleResponse(true, "successfully added user in database", 409);
    }

    //send verificaion email

    const emailResponse = SendVerificationEmail(email, username, verifyCode);

    console.log(emailResponse);
  } catch (err) {
    return simpleResponse(false, "error registering accounting", 500);
  }
}
