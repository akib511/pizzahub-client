import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI!);

const db = client.db("PizzaHub");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },


user: {
 additionalFields: {
  role: {
    type: "string",
    required: false,
    defaultValue: "buyer",
    input: true,
  },

  profileImage: {
    type: "string",
    required: false,
    input: false,
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


  database: mongodbAdapter(db, {
    client,
  }),
});