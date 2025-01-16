import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignInButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loginWithGoogle = async () => {
        try {
            setIsLoading(true);
            await signIn('google', { callbackUrl: 'http://localhost:3000' });
        } catch (err) {
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={loginWithGoogle}
            className="flex items-center justify-center w-full text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium text-sm px-5 py-2.5 text-center"
        >
            <FcGoogle size={20} className="mr-2" />
            Sign in with Google
        </button>
    );
};

export default GoogleSignInButton;
