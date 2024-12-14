import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8081/api/signup", {
                email,
                password,
                name,
                phone,
            });

            console.log("Response from server:", response.data);
            if (response.data === "exist") {
                alert("User already exists");
            }
            else if (response.data === "notexist") {
                localStorage.setItem('email', email);
                await sendConfirmationEmail();
                navigate("/");
                history("/", { state: { id: email } });
            }
        }
        catch (error) {
            alert("Failed to sign up. Please try again.");
            console.error("Error during signup:", error);
        }
    }

    const sendConfirmationEmail = async () => {
        const userEmail = localStorage.getItem('email');
        try {
            const response = await fetch('http://localhost:8081/send-confirmation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Email sent successfully:', data.message);
            }
            else {
                console.error('Failed to send email:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">SIGN UP</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>

                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300  text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300  text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Phone Number</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition duration-300"
                    >
                        SIGN UP
                    </button>
                </form>
            </div>
        </div>
    );
};
