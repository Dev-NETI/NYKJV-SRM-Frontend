"use client";

import dynamic from "next/dynamic";
import LogoCanvas from "../../components/logo/srm/Logo";

const AuthCard = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center custom-bg-nyk py-8">
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full min-h-full bg-gray-50 shadow-md sm:rounded-none">
      {/* Logo Section */}
      <div className="hidden sm:flex justify-center items-center w-full sm:w-1/2 min-h-full custom-bg-nyk sticky top-0">
        <LogoCanvas />
      </div>

      {/* Login Form Section */}
      <div className="w-full sm:w-1/2 min-h-full flex items-center justify-center px-6 py-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthCard;
