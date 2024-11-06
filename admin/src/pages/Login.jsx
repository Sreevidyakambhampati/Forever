// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import axios from 'axios';
import { backendUrl } from '../App';
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
    const [userEmail, setUserEmail] = useState("");

    const handleGoogleLogin = () => {
        window.open(`${backendUrl}/auth/google`, '_self');
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        return regex.test(email);
    };

    const handleUserRequest = async () => {
        if (!validateEmail(userEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            let res = await axios.post(`${backendUrl}/request`, { email: userEmail }, { withCredentials: true });
            console.log(res);
            alert(res?.data?.message || 'Request Sent to Admin!');
            setUserEmail('');
        } catch (error) {
            console.log(error);
            alert(error?.response?.data?.message || error?.message || 'Error while requesting for access');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Welcome Back!</h2>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Enter your email to request access"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <button
                        onClick={handleUserRequest}
                        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none"
                    >
                        Request Access
                    </button>
                </div>

                <div className="text-center text-gray-600">or</div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full px-4 py-2 flex items-center justify-center space-x-2 rounded-lg border border-gray-300 hover:bg-red-100 out"
                >
                    <FcGoogle className="text-2xl" />
                    <span>Sign In with Google</span>
                </button>

            </div>
        </div>
    );
}