import express, { Request, Response } from "express";
import verifyToken from "../middleware/auth";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel) => {
      const userBookings = hotel.bookings.filter(
        (booking) => booking.userId === req.userId
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

// Delete booking
router.delete("/:bookingId", verifyToken, async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const hotel = await Hotel.findOne({
      bookings: { $elemMatch: { _id: bookingId, userId: req.userId } },
    });

    if (!hotel) {
      return res.status(404).json({ message: "Booking not found" });
    }

    hotel.bookings = hotel.bookings.filter(
      (booking) => booking._id.toString() !== bookingId
    );

    await hotel.save();

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
});


export default router;