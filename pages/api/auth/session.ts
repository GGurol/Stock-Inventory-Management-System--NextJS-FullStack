import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "@/utils/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const token = req.cookies["session_id"];
    console.log("SESSION API: Cookie received:", token);

    if (!token) {
      console.log("SESSION API: No token found.");
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const decoded = verifyToken(token);
    console.log("SESSION API: Decoded token:", decoded);

    if (!decoded) {
      console.log("SESSION API: Token is invalid or expired.");
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true }, // Select only safe fields
    });
    console.log("SESSION API: User found in DB:", user);

    if (!user) {
      console.log("SESSION API: User ID from token not found in DB.");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Return user data
    return res.status(200).json(user);

  } catch (error) {
    console.error("SESSION API: Internal Server Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}