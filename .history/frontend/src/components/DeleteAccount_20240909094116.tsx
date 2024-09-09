import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount } from '../api-client';
import Modal from 'react-modal';
import { useMutation } from "react-query";

Modal.setAppElement('#root');

const DeleteAccount: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setMessage('Account deleted successfully');
      setMessageType('success');
      // Handle successful deletion (e.g., redirect to home page, clear local storage, etc.)
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setMessageType('error');
    } finally {
      setIsDeleting(false);
      handleCloseModal();
    }
  };

  const mutation = useMutation(apiClient.signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
    },
  });

  return (
    <div>
      <button
        type="button"
        onClick={handleOpenModal}
        className="bg-rose-600 text-white text-xl font-bold p-2 hover:bg-rose-500 rounded-sm mt-4"
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
          <p className="mb-4">Are you sure you want to delete your account? This action cannot be undone.</p>
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

      {message && (
        <div
          className={`mt-4 w-full rounded-md py-2 px-3 ${
            messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          } border`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;