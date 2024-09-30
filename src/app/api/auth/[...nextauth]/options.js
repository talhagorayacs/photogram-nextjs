import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "Credentials",

      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.email }, // Use credentials.email for username
              { email: credentials.email },    // And credentials.email for email
            ],
          });
          if (!user) {
            throw new Error("User not found with this username or email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email first");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Password incorrect");
          }
        } catch (error) {
          throw new Error(error.message || "Authorization failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "sign-in",
  },
  session: {
    strategy: "jwt", // Fix typo: strategy instead of stratrgy
  },
  secret: process.env.NEXT_SECRET_KEY,
};
