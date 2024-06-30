import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";

export async function SendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "anon-feedback | Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "successfully sent the verification email",
    };
  } catch (EmailError) {
    console.log("failed to send verification email", EmailError);
    return {
      success: false,
      message: "error occoured while sending verification email",
    };
  }
}
