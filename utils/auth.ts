import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, User as PrismaUser } from "@prisma/client";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

type User = Omit<PrismaUser, "password">; // Return a User type without the password

// --- SERVER-SIDE UTILITIES ---

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

export const getSessionServer = async (
  req: NextApiRequest,
  res: NextApiResponse 
): Promise<User | null> => {
  const token = req.cookies["session_id"];
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      createdAt: true,
      email: true,
      name: true,
      updatedAt: true,
      username: true,
    },
  });

  return user;
};

// --- CLIENT-SIDE UTILITY ---

export const getSessionClient = async (): Promise<User | null> => {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Important: sends cookies with the request
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    }
    return null;
  } catch (error) {
    console.error("Error fetching session:", error);
    return null;
  }
};