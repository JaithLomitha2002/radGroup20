import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import * as apiClient from '../api-client';
import Modal from "react-modal";

// Ensure Modal is accessible
Modal.setAppElement('#root');

const DeleteAccount: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      closeModal();
    }
  };

  return (
    <div>
      <button onClick={openModal}>Delete My Account</button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Delete Account Confirmation"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '400px',
          },
        }}
      >
        <h2>Delete Account</h2>
        <p>Warning: This action is irreversible and will permanently delete all your data, including:</p>
        <ul>
          <li>Your profile information</li>
          <li>Your bookings</li>
          <li>Your hotel listings (if any)</li>
          <li>Any reviews you've left</li>
        </ul>
        <p>Are you sure you want to proceed?</p>
        <div>
          <button onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
          </button>
          <button onClick={closeModal}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteAccount;