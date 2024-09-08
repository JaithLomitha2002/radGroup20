import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Modal from "react-modal";
import * as apiClient from "../api-client";

// Set the app element for accessibility
Modal.setAppElement("#root");

const MyBookings = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  const { data: hotels } = useQuery("fetchMyBookings", apiClient.fetchMyBookings);

  const deleteBookingMutation = useMutation(
    (bookingId: string) => apiClient.deleteBookingById(bookingId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("fetchMyBookings");
        setIsModalOpen(false); // Close modal after successful deletion
      },
    }
  );

  const handleDelete = (bookingId: string) => {
    setBookingToDelete(bookingId);
    setIsModalOpen(true); // Open modal
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      deleteBookingMutation.mutate(bookingToDelete);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setBookingToDelete(null);
  };

  if (!hotels || hotels.length === 0) {
    return <span>No bookings found</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {hotels.map((hotel) => (
        <div key={hotel._id} className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5">
          <div className="lg:w-full lg:h-[250px]">
            <img
              src={hotel.imageUrls[0]}
              className="w-full h-full object-cover object-center"
              alt={hotel.name}
            />
          </div>
          <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
            <div className="text-2xl font-bold">
              {hotel.name}
              <div className="text-xs font-normal">
                {hotel.city}, {hotel.country}
              </div>
            </div>
            {hotel.bookings.map((booking) => (
              <div key={booking._id}>
                <div>
                  <span className="font-bold mr-2">Dates: </span>
                  <span>
                    {new Date(booking.checkIn).toDateString()} -
                    {new Date(booking.checkOut).toDateString()}
                  </span>
                </div>
                <div>
                  <span className="font-bold mr-2">Guests:</span>
                  <span>
                    {booking.adultCount} adults, {booking.childCount} children
                  </span>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleDelete(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={cancelDelete}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Confirm Deletion"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-4">Are you sure you want to delete this booking?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Yes, Delete
            </button>
            <button
              onClick={cancelDelete}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyBookings;
