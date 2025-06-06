"use client";
import React from 'react';
import UserProfile from '../../../components/UserProfile';
import SignOutButton from '../../../components/Signout';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <UserProfile />
        <div className="max-w-2xl mx-auto mt-8 p-4">
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;