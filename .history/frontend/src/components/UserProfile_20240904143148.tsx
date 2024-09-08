import { useQuery } from "react-query";
import * as apiClient from "../api-client";

const UserProfile = () => {
  const { data: userProfile, isLoading, error } = useQuery(
    "fetchUserProfile",
    apiClient.fetchUserProfile
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (error || !userProfile) {
    return <span>Unable to load user profile</span>;
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <div className="border border-slate-300 rounded-lg p-8 gap-5">
        <div className="flex items-center gap-5">
          <img
            src={userProfile.avatarUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full"
          />
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{userProfile.name}</span>
            <span className="text-sm text-gray-500">{userProfile.email}</span>
          </div>
        </div>
        <div className="mt-5">
          <h2 className="text-xl font-semibold">Details</h2>
          <div>
            <span className="font-bold mr-2">City:</span>
            <span>{userProfile.city}</span>
          </div>
          <div>
            <span className="font-bold mr-2">Country:</span>
            <span>{userProfile.country}</span>
          </div>
          <div>
            <span className="font-bold mr-2">Phone:</span>
            <span>{userProfile.phone}</span>
          </div>
          {/* Add more details as necessary */}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
