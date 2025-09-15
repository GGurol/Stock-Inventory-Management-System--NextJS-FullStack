import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../utils/auth"; // Assuming this utility exists
import Cookies from "cookies";

const prisma = new PrismaClient();

// Define a schema for validating the login request body
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  // --- CORS Preflight Handling ---
  // This allows your local frontend to get permission from the browser.
  if (req.method === "OPTIONS") {
    // Use the frontend URL from environment variables for the allowed origin
    res.setHeader("Access-Control-Allow-Origin", process.env.NEXTAUTH_URL || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.status(204).end();
  }

  // Handle only POST requests for login
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // 1. Validate the incoming data
    const { email, password } = loginSchema.parse(req.body);

    // 2. Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Compare the provided password with the hashed password in the DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4. Generate a JWT token
    const token = generateToken(user.id);

    // 5. Set the token in an HTTP-Only cookie for security
    const isSecure = process.env.NODE_ENV === "production";
    const cookies = new Cookies(req, res, { secure: isSecure });
    
    cookies.set("session_id", token, {
      httpOnly: true, // Prevents client-side script access
      secure: isSecure, // Use secure cookies in production
      sameSite: "lax", // Recommended for most cases
      path: "/",       // Make the cookie available on all pages
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    
    // 6. Send a success response
    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Login API Error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input", details: error.flatten().fieldErrors });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}