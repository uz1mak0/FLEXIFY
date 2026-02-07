'use client';

import { useState } from 'react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Fitness enthusiast and tech lover',
    location: 'New York, USA',
    phone: '+1 234 567 8900',
    birthdate: '1990-01-01',
    website: 'https://example.com'
  });
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setEditedProfile(userProfile);
  };

  const handleProfileSave = () => {
    setUserProfile(editedProfile);
    setIsEditingProfile(false);
  };

  const handleProfileCancel = () => {
    setEditedProfile(userProfile);
    setIsEditingProfile(false);
  };

  const handleClose = () => {
    setIsEditingProfile(false);
    setEditedProfile(userProfile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-white/95 dark:bg-gray-900/95 frosted-glass border border-white/20 rounded-lg p-6 z-60 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-3xl">
            {userProfile.name[0]}
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{userProfile.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{userProfile.email}</p>
          </div>
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            {isEditingProfile ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {userProfile.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            {isEditingProfile ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {userProfile.email}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Bio
            </label>
            {isEditingProfile ? (
              <textarea
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white min-h-[80px]"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {userProfile.bio}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            {isEditingProfile ? (
              <input
                type="text"
                value={editedProfile.location}
                onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {userProfile.location}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            {isEditingProfile ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {userProfile.phone}
              </p>
            )}
          </div>

          {/* Birthdate */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Birth Date
            </label>
            {isEditingProfile ? (
              <input
                type="date"
                value={editedProfile.birthdate}
                onChange={(e) => setEditedProfile({ ...editedProfile, birthdate: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                {new Date(userProfile.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Website
            </label>
            {isEditingProfile ? (
              <input
                type="url"
                value={editedProfile.website}
                onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            ) : (
              <p className="p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white">
                <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {userProfile.website}
                </a>
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3">
          {isEditingProfile ? (
            <>
              <button
                onClick={handleProfileCancel}
                className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileSave}
                className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={handleProfileEdit}
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-500 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
