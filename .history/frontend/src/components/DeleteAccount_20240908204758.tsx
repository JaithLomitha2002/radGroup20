import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import * as apiClient from '../api-client';
import Modal from "react-modal";

// Ensure Modal is accessible
Modal.setAppElement("#root");

const DeleteAccount: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await apiClient.deleteAccount();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
      handleCloseModal();
    }
  };

  return (
    <div>
      <button
        onClick={handleOpenModal}
        className="bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Delete My Account
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        contentLabel="Confirm Account Deletion"
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h2 className="text-xl font-bold mb-4">Confirm Account Deletion</h2>
          <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data, including:</p>
          <ul className="list-disc list-inside mb-4 text-left">
            <li>Your profile information</li>
            <li>Your bookings</li>
            <li>Your hotel listings (if any)</li>
            <li>Any reviews you've left</li>
          </ul>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:bg-red-300"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
            </button>
            <button
              onClick={handleCloseModal}
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

export default DeleteAccount;