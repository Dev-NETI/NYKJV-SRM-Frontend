"use client";

import dynamic from "next/dynamic";

const LogoCanvas = dynamic(() => import("@/components/logo/srm/Logo"), {
  ssr: false,
});

const AuthCard = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center custom-bg-nyk">
    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full h-full bg-white shadow-md sm:rounded-none">
      {/* Logo Section */}
      <div className="hidden sm:flex justify-center items-center w-full sm:w-1/2 h-full custom-bg-nyk">
        <LogoCanvas />
      </div>

      {/* Login Form Section */}
      <div className="w-full sm:w-1/2 h-full flex items-center justify-center px-6 py-8">
        {children}
      </div>
    </div>
  </div>
);

export default AuthCard;
