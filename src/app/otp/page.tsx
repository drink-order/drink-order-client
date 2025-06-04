'use client'

import OtpLogin from "../components/OtpLogin";
import React, { Suspense } from 'react';

const OtpVerificationPage = () => {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OtpLogin />
    </Suspense>
  );
};

export default OtpVerificationPage;