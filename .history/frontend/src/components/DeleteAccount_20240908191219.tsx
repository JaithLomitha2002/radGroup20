
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as apiClient from '../api-client';

const DeleteAccount: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await apiClient.deleteAccount();
        // Clear any stored auth tokens or user data
        localStorage.removeItem('token');
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div>
      <h2>Delete Account</h2>
      <p>Warning: This action is irreversible and will permanently delete all your data.</p>
      <button onClick={handleDeleteAccount} disabled={isDeleting}>
        {isDeleting ? 'Deleting...' : 'Delete My Account'}
      </button>
    </div>
  );
};

export default DeleteAccount;

