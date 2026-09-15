import { createPrismaClient } from "@aws-platform/db";
import { env } from "@aws-platform/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export function createAuth() {
  const prisma = createPrismaClient();
  const webUrl = env.CORS_ORIGIN;

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),

    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
      sendResetPassword: async ({ user, url }: { user: { email: string; name: string }; url: string }) => {
        const token = url.split("token=")[1] || url;
        const resetUrl = `${webUrl}/reset-password?token=${token}`;
        void resend.emails.send({
          from: "AWS Builder Group Bahria University <name@resend.dev>",  //add real gmail here
          to: user.email,
          subject: "Reset your password",
          html: `
            <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a1a1a;">Reset Your Password</h2>
              <p style="color: #555; font-size: 14px;">
                Hi ${user.name}, you requested a password reset. Click the button below to set a new password.
              </p>
              <a href="${resetUrl}" style="display: inline-block; background: #FF9900; color: #000; font-weight: 600; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0;">
                Reset Password
              </a>
              <p style="color: #999; font-size: 12px;">
                This link expires in 1 hour. If you didn't request this, ignore this email.
              </p>
            </div>
          `,
        });
      },
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
        otpLength: 6,
        expiresIn: 600,
        allowedAttempts: 5,
        async sendVerificationOTP({email, otp, type}) {
          const subject =
          type === "email-verification"
          ? "verify your email"
          : type === "sign-in"
          ? "Your sign in code"
          : "Your password reset code";

        void resend.emails.send({
          from: "AWS Student Builder Group Bahria University <name@resend.dev>",  //add real gmail here
          to: email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width:400px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1a1a1a;">Your Verification code</h2>
            <p style="color: #555: font-size: 14px;">
            ${type === "email-verification" ? "Use the code below to verify your email" : "use the code below to continue"}
            </p>
            <div style="background: #f4f4f4; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ff9900;">${otp}</span>
            </div>
            <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, ignore this email.</p>
            </div>
            `,
        })
        }
      })
    ],
  });
}

export const auth = createAuth();
