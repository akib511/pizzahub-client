import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import {
  APIError,
  createAuthMiddleware,
  getOAuthState,
} from "better-auth/api";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db("PizzaHub");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      profileImage: {
        type: "string",
        required: false,
        input: false,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

 
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Email Signup
      if (ctx.path === "/sign-up/email") {
        const role = ctx.body?.role;

        if (role !== "customer" && role !== "vendor") {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid user role",
          });
        }
      }

      // Google Signup
      if (ctx.path === "/sign-in/social") {
        const role = ctx.body?.additionalData?.role;

        if (
          role !== undefined &&
          role !== "customer" &&
          role !== "vendor"
        ) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid user role",
          });
        }
      }

      
      if (
        ctx.path === "/update-user" &&
        ctx.body?.role !== undefined
      ) {
        throw new APIError("FORBIDDEN", {
          message: "You cannot change your role",
        });
      }
    }),
  },

  
databaseHooks: {
  user: {
    create: {
      before: async (user, ctx) => {
        if (ctx?.path === "/callback/:id") {
          const oauthData = await getOAuthState<{
            role?: string;
          }>();

          const requestedRole = oauthData?.role;

          return {
            data: {
              ...user,
              role:
                requestedRole === "vendor"
                  ? "vendor"
                  : "customer",
            },
          };
        }

        return {
          data: {
            ...user,
            role: user.role === "vendor" ? "vendor" : "customer",
          },
        };
      },
    },
  },
},

  database: mongodbAdapter(db, { client }),
});