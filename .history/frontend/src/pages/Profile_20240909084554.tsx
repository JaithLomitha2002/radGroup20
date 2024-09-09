import React, { useState } from "react";
import { useQuery } from "react-query";
import { fetchUserProfile, updateProfile } from "../api-client";
import DeleteAccount from '../components/DeleteAccount';

const UserProfile = () => {
  const { data: userProfile, isLoading, error, refetch } = useQuery(
    "fetchUserProfile",
    fetchUserProfile
  );

  const [editableProfile, setEditableProfile] = useState({
    telephone: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  React.useEffect(() => {
    if (userProfile) {
      setEditableProfile({
        telephone: userProfile.telephone || "",
        address: userProfile.address || "",
      });
    }
  }, [userProfile]);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error || !userProfile) {
    return <span>Unable to load user profile</span>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableProfile({ ...editableProfile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile(editableProfile);
      setMessage("Profile updated successfully");
      setMessageType("success");
      refetch(); // Refetch the user profile to get the updated data
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
      setMessageType("error");
    }
  };

  const handleClear = () => {
    setEditableProfile({ telephone: "", address: "" });
    setMessage("Fields cleared");
    setMessageType("info");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">My Profile</h1>
      <div className="border border-slate-300 rounded-lg p-8 gap-5">
        <div className="flex items-center gap-5 mb-5">
          <img
            src={userProfile.avatarUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{userProfile.firstName} {userProfile.lastName}</span>
            <span className="text-sm text-gray-500">{userProfile.email}</span>
          </div>
        </div>
        <form className="grid grid-cols-1 gap-4">
          <div className="col-span-1">
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
              Telephone:
            </label>
            <input
              type="text"
              id="telephone"
              name="telephone"
              value={editableProfile.telephone}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Address:
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={editableProfile.address}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleSave}
              className="bg-indigo-600 text-white text-xl font-bold p-2 hover:bg-indigo-500 rounded-sm mt-4"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-600 text-white text-xl font-bold p-2 hover:bg-gray-500 rounded-sm mt-4"
            >
              Clear
            </button>
            <DeleteAccount />
          </div>
        </form>
        {message && (
          <div
            className={`mt-4 w-full rounded-md py-2 px-3 ${
              messageType === 'success' ? 'bg-green-100 text-green-800' : 
              messageType === 'error' ? 'bg-red-100 text-red-800' : 
              'bg-gray-100 text-gray-800'
            } border`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;