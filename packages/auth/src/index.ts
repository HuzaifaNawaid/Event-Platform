import { createPrismaClient } from "@aws-platform/db";
import { env } from "@aws-platform/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export function createAuth() {
  const prisma = createPrismaClient();

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),

    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
    },
    emailVerification: {
      sendOnSignUp: true,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [
      emailOTP({
        overrideDefaultEmailVerification: true,
        otpLength: 6,
        expiresIn: 600,
        allowedAttempts: 5,
        async sendVerificationOTP({ email, otp, type }) {
          const subject =
            type === "email-verification"
              ? "Verify your email"
              : type === "sign-in"
                ? "Your sign-in code"
                : "Your password reset code";

          const { error } = await resend.emails.send({
            from: "AWS Student Builder Group Bahria University <onboarding@resend.dev>",
            to: email,
            subject,
            html: `
              <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a1a1a;">Your Verification Code</h2>
                <p style="color: #555; font-size: 14px;">
                  ${type === "email-verification" ? "Use the code below to verify your email." : "Use the code below to continue."}
                </p>
                <div style="background: #f4f4f4; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
                  <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ff9900;">${otp}</span>
                </div>
                <p style="color: #999; font-size: 12px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
              </div>
            `,
          });
          if (error) {
            console.error("Failed to send OTP email:", error);
          }
        },
      }),
    ],
  });
}

export const auth = createAuth();
