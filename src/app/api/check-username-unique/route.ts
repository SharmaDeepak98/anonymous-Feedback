import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import simpleResponse from "@/lib/simpleResponse";

const usernameQuerySchema = z.object({
  username: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = usernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const userNameErrors = result.error.format().username?._errors || [];
      return simpleResponse(
        false,
        userNameErrors?.length > 0
          ? userNameErrors.join(", ")
          : "Invalid query parameter",
        400
      );
    }

    console.log(result); //TODO remove
    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return simpleResponse(false, "username already taken", 409);
    }

    return simpleResponse(true, "username is unique", 500);
  } catch (error) {
    return simpleResponse(false, "error checking username", 400);
  }
}
