'use client'

import OtpLogin from "../components/OtpLogin";
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';

const OtpVerificationPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <OtpLogin />
    </div>
    </Suspense>
  );
};

export default OtpVerificationPage;