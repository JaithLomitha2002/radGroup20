import React, { useState, useEffect } from "react";
import { fetchCurrentUser, updateProfile } from "../api-client";
import DeleteAccount from '../components/DeleteAccount';

const Profile = () => {
  const [user, setUser] = useState({ firstName: "", lastName: "", email: "", telephone: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // To manage message type (success or error)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateProfile({ telephone: user.telephone, address: user.address });
      setMessage("Profile updated successfully");
      setMessageType("success"); // Set message type to success
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Error updating profile");
      setMessageType("error"); // Set message type to error
    }
  };

  const handleClear = () => {
    setUser({ ...user, telephone: "", address: "" });
    setMessage("Fields cleared");
    setMessageType("info"); // Set message type to info
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form className="grid grid-cols-1 gap-4">
        <div className="col-span-1">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={user.firstName}
            readOnly
            className="w-full rounded-md border border-gray-700 py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={user.lastName}
            readOnly
            className="w-full rounded-md border border-gray-700 py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            readOnly
            className="w-full rounded-md border border-gray-700 py-2 px-3 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div className="col-span-1">
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
            Telephone:
          </label>
          <input
            type="text"
            id="telephone"
            name="telephone"
            value={user.telephone}
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
            value={user.address}
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

        {message && (
          <input
            type="text"
            value={message}
            readOnly
            className={`mt-4 w-full rounded-md py-2 px-3 ${messageType === 'success' ? 'bg-green-100 text-green-800' : messageType === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'} border`}
          />
        )}
      </form>
    </div>
  );
};

export default Profile;
