import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import User from "../models/user";
import { UserType } from "../shared/types";

const router = express.Router();

// /api/user-profile
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId).select("-password"); // Fetch the user excluding sensitive fields like password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfile: UserType = {
      ...user.toObject(),
    };

    res.status(200).send(userProfile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch user profile" });
  }
});

export default router;
