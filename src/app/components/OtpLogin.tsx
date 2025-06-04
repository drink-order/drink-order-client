'use client';

import React, { useEffect, useState, useTransition, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../context/AuthContext";

function OtpLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { verifyOTP, sendOTP } = useAuth();

  // Get data from query params or sessionStorage
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isForRegistration, setIsForRegistration] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isPending, startTransition] = useTransition();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize component with data from URL params or sessionStorage
  useEffect(() => {
    const phoneParam = searchParams.get("phone");
    const nameParam = searchParams.get("name");
    const storedPassword = sessionStorage.getItem('temp_registration_password');
    
    if (phoneParam) {
      setPhoneNumber(phoneParam);
      setIsForRegistration(true);
    }
    
    if (nameParam) {
      setName(nameParam);
    }
    
    if (storedPassword) {
      setPassword(storedPassword);
    }

    // Only redirect if we don't have phone number (required for any OTP verification)
    if (!phoneParam) {
      toast({
        title: "Error",
        description: "Phone number is required for verification",
        variant: "destructive",
      });
      router.push("/sign-up");
    }
  }, [searchParams, router, toast]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [resendCountdown]);

  // Debounced verify function to prevent multiple calls
  const verifyOtpCode = useCallback(async () => {
    if (!otp || otp.length !== 6 || isVerifying || isPending) {
      return;
    }

    setIsVerifying(true);
    startTransition(async () => {
      setError("");
      setSuccess("");

      try {
        let result;
        
        if (isForRegistration) {
          // For registration, we need to pass user data
          result = await verifyOTP(phoneNumber, otp, {
            name: name,
            password: password
          });
        } else {
          // For login, just verify OTP
          result = await verifyOTP(phoneNumber, otp);
        }

        if (result.success) {
          // Clear temporary password
          sessionStorage.removeItem('temp_registration_password');
          
          setSuccess("Verification successful!");
          
          if (isForRegistration) {
            toast({
              title: "Success",
              description: "Account created successfully! Welcome!",
              variant: "default",
            });
          } else {
            toast({
              title: "Success",
              description: "Logged in successfully!",
              variant: "default",
            });
          }
          
          // Small delay before redirect to show success message
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          setError(result.error || "OTP verification failed");
          setOtp(""); // Clear OTP on error
          // Focus first input
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        setError("Something went wrong. Please try again.");
        setOtp(""); // Clear OTP on error
        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } finally {
        setIsVerifying(false);
      }
    });
  }, [otp, phoneNumber, name, password, isForRegistration, verifyOTP, router, toast, isVerifying, isPending]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isVerifying && !isPending) {
      const timer = setTimeout(() => {
        verifyOtpCode();
      }, 500); // Small delay to prevent rapid fire
      
      return () => clearTimeout(timer);
    }
  }, [otp, verifyOtpCode, isVerifying, isPending]);

  // Function to resend OTP
  const resendOtp = async () => {
    if (resendCountdown > 0 || isPending) return;

    setResendCountdown(60);
    startTransition(async () => {
      setError("");
      setSuccess("");
      setOtp(""); // Clear current OTP

      try {
        const result = await sendOTP(phoneNumber, name);
        
        if (result.success) {
          setSuccess("OTP sent successfully!");
          toast({
            title: "Success",
            description: "New OTP sent to your phone",
            variant: "default",
          });
          // Focus first input after resend
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        } else {
          setError(result.error || "Failed to send OTP");
          setResendCountdown(0);
        }
      } catch (error) {
        console.error("Resend OTP error:", error);
        setError("Failed to resend OTP. Please try again.");
        setResendCountdown(0);
      }
    });
  };

  // Handle OTP input change for individual boxes
  const handleOtpInputChange = (index, value) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const newOtp = otp.split('');
    while (newOtp.length < 6) newOtp.push(''); // Ensure array has 6 elements
    newOtp[index] = digit;
    
    const newOtpString = newOtp.join('');
    setOtp(newOtpString);
    setError(""); // Clear error when user types
    
    // Auto-focus next input if digit entered
    if (digit && index < 5) {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  // Handle backspace and navigation
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newOtp = otp.split('');
      while (newOtp.length < 6) newOtp.push(''); // Ensure array has 6 elements
      
      if (newOtp[index]) {
        // Clear current digit
        newOtp[index] = '';
        setOtp(newOtp.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          newOtp[index - 1] = '';
          setOtp(newOtp.join(''));
          prevInput.focus();
        }
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      setOtp(pastedData);
      setError("");
      // Focus the last filled input or the next empty one
      const focusIndex = Math.min(pastedData.length - 1, 5);
      if (inputRefs.current[focusIndex]) {
        inputRefs.current[focusIndex].focus();
      }
    }
  };

  // Loading spinner
  const loadingIndicator = (
    <div role="status" className="flex justify-center">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (!phoneNumber) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {loadingIndicator}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Verify Your Phone</h2>
        <p className="text-gray-600 text-center mb-6">
          We sent a 6-digit verification code to
          <br />
          <span className="font-semibold">{phoneNumber}</span>
        </p>

        {/* OTP Input */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2" onPaste={handlePaste}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index] || ''}
                onChange={(e) => handleOtpInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100"
                disabled={isPending || isVerifying}
                autoComplete="one-time-code"
              />
            ))}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-4 p-2 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-500 text-sm text-center mb-4 p-2 bg-green-50 rounded">
            {success}
          </div>
        )}

        {/* Loading Indicator */}
        {(isPending || isVerifying) && (
          <div className="flex justify-center mb-4">
            {loadingIndicator}
          </div>
        )}

        {/* Manual Verify Button */}
        <button
          onClick={verifyOtpCode}
          disabled={isPending || isVerifying || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4 transition-colors"
        >
          {isPending || isVerifying ? "Verifying..." : "Verify Code"}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={resendOtp}
            disabled={resendCountdown > 0 || isPending || isVerifying}
            className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {resendCountdown > 0 
              ? `Resend in ${resendCountdown}s` 
              : "Resend Code"
            }
          </button>
        </div>

        {/* Back to Sign Up */}
        <div className="text-center mt-6">
          <button
            onClick={() => {
              sessionStorage.removeItem('temp_registration_password');
              router.push("/sign-up");
            }}
            disabled={isPending || isVerifying}
            className="text-gray-500 hover:text-gray-700 text-sm disabled:text-gray-300 transition-colors"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default OtpLogin;