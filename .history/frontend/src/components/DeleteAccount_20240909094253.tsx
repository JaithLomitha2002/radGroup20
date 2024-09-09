import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteAccount, signOut } from '../api-client';
import Modal from 'react-modal';
import { useMutation, useQueryClient } from "react-query";
import { useAppContext } from '../contexts/AppContext';

Modal.setAppElement('#root');

const DeleteAccount: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const deleteMutation = useMutation(deleteAccount, {
    onSuccess: async () => {
      showToast({ message: "Account deleted successfully", type: "SUCCESS" });
      await signOutMutation.mutateAsync();
    },
    onError: (error: Error) => {
      console.error('Error deleting account:', error);
      showToast({ message: error.message || "An unexpected error occurred", type: "ERROR" });
    },
    onSettled: () => {
      handleCloseModal();
    }
  });

  const signOutMutation = useMutation(signOut, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Signed Out!", type: "SUCCESS" });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    }
  });

  const handleDeleteAccount = () => {
    deleteMutation.mutate();
  };

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
              disabled={deleteMutation.isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:bg-red-300"
            >
              {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
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