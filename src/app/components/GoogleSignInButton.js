import { FcGoogle } from 'react-icons/fc';

const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    // Logic to handle Google Sign-In
    console.log('Google Sign-In triggered');
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className="flex items-center justify-center w-full text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm px-5 py-2.5 text-center"
    >
      <FcGoogle size={20} className="mr-2" />
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
