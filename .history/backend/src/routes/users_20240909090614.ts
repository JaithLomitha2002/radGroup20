import express, { Request, Response } from "express";
import User from "../models/user";
import Hotel from "../models/hotel";  // Adjust the import path as needed
// import Booking from "../models/booking";  // Adjust the import path as needed
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";
import verifyToken from "../middleware/auth";

const router = express.Router();

router.get("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      });
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
);

router.put("/me", verifyToken, async (req: Request, res: Response) => {
  const userId = req.userId;
  const { telephone, address } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { telephone, address },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

router.delete('/delete-account', verifyToken, async (req: Request, res: Response) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const userId = req.userId;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user's hotels
    await Hotel.deleteMany({ userId: userId });

    // Delete user's bookings
    //await Booking.deleteMany({ userId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    // Commit the transaction
    await session.commitTransaction();

    // Clear the authentication cookie
    res.clearCookie('auth_token');

    res.status(200).json({ message: 'Account and associated data deleted successfully' });
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();

    console.error('Error in delete-account route:', error);
    res.status(500).json({ message: 'An error occurred while deleting the account' });
  } finally {
    session.endSession();
  }
});

export default router;