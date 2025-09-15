import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Define the shape of the incoming data for validation
const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // --- 1. Handle CORS Preflight Request ---
  // This block allows your frontend to get permission from the browser.
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  // --- 2. Handle only POST requests for registration ---
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // --- 3. Main Logic with Detailed Error Handling ---
  try {
    // Validate the incoming request body against our schema
    const { name, email, password } = registerSchema.parse(req.body);

    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database using only Prisma
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // Prisma will handle default values like createdAt
      },
      select: { // Select only the fields that are safe to return
        id: true,
        name: true,
        email: true,
      }
    });

    // Send a success response
    return res.status(201).json(newUser);

  } catch (error) {
    // --- 4. DETAILED ERROR LOGGING ---
    // This will print the full error to your backend terminal logs
    console.error("REGISTRATION FAILED:", error);

    // Handle Zod validation errors specifically
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", details: error.flatten().fieldErrors });
    }

    // Handle other generic errors
    return res.status(500).json({ message: "An unexpected error occurred during registration." });
  }
}