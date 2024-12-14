import React, { useState } from "react";
import axios from "axios";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8081/forgot-password", { email });

            if (response.data.message === "emailSent") {
                setMessage("Password reset link has been sent to your email.");
            } else {
                setMessage("Email not registered.");
            }
        } catch (error) {
            setMessage("Error occurred. Please try again.");
            console.error("Error during password reset:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forgot Password</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="submit"
                        value="Submit"
                        className="w-full bg-green-500 text-white py-2 hover:bg-green-600 transition duration-300"
                    />
                </form>

                {message && <p className="text-center text-gray-500 mt-4">{message}</p>}
            </div>
        </div>
    );
};
