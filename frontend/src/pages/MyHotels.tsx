import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import Modal from "react-modal";
import * as apiClient from "../api-client";
import { Link } from "react-router-dom";
import { BsBuilding, BsMap } from "react-icons/bs";
import { BiHotel, BiMoney, BiStar } from "react-icons/bi";

// Set the app element for accessibility
Modal.setAppElement("#root");

const MyHotels = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState<string | null>(null);

  const { data: hotelData } = useQuery("fetchMyHotels", apiClient.fetchMyHotels, {
    onError: () => {},
  });

  const deleteHotelMutation = useMutation(apiClient.deleteMyHotelById, {
    onSuccess: () => {
      queryClient.invalidateQueries("fetchMyHotels");
      setIsModalOpen(false); // Close modal after successful deletion
    },
  });

  const handleDelete = (hotelId: string) => {
    setHotelToDelete(hotelId);
    setIsModalOpen(true); // Open modal
  };

  const confirmDelete = () => {
    if (hotelToDelete) {
      deleteHotelMutation.mutate(hotelToDelete);
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setHotelToDelete(null);
  };

  if (!hotelData) {
    return <span>No Hotels found</span>;
  }

  return (
    <div className="space-y-5">
      <span className="flex justify-between">
        <h1 className="text-3xl font-bold">My Hotels</h1>
        <Link
          to="/add-hotel"
          className="flex bg-rose-600 text-white text-xl font-bold p-2 hover:bg-rose-500 rounded-sm"
        >
          Add Hotel
        </Link>
      </span>
      <div className="grid grid-cols-1 gap-8">
        {hotelData.map((hotel) => (
          <div
            key={hotel._id}
            data-testid="hotel-card"
            className="flex flex-col justify-between border border-slate-300 rounded-lg p-8 gap-5"
          >
            <h2 className="text-2xl font-bold">{hotel.name}</h2>
            <div className="whitespace-pre-line">{hotel.description}</div>
            <div className="grid grid-cols-5 gap-2">
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsMap className="mr-1" />
                {hotel.city}, {hotel.country}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BsBuilding className="mr-1" />
                {hotel.type}
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiMoney className="mr-1" />Rs. {hotel.pricePerNight} per night
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiHotel className="mr-1" />
                {hotel.adultCount} adults, {hotel.childCount} children
              </div>
              <div className="border border-slate-300 rounded-sm p-3 flex items-center">
                <BiStar className="mr-1" />
                {hotel.starRating} Star Rating
              </div>
            </div>
            <span className="flex justify-end gap-2">
              <Link
                to={`/edit-hotel/${hotel._id}`}
                className="flex bg-rose-600 text-white text-xl font-bold p-2 hover:bg-rose-500 rounded-sm"
              >
                Edit Details
              </Link>
              <button
                onClick={() => handleDelete(hotel._id)}
                className="flex bg-red-600 text-white text-xl font-bold p-2 hover:bg-red-500 rounded-sm"
              >
                Delete Hotel
              </button>
            </span>
          </div>
        ))}
      </div>

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
          <p className="mb-4">Are you sure you want to delete this hotel?</p>
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

export default MyHotels;
