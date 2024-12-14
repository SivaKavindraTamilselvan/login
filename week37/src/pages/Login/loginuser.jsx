import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); 

    const submit = async (e) => {
        e.preventDefault();

        try {
            console.log("Login data:", { email, password, role });

            let url;
            if (role === "user") {
                url = "http://localhost:8081/";
            } else if (role === "company") {
                url = "http://localhost:8081/get-company"; 
            } else if (role === "placement") {
                url = "http://localhost:8081/get-main"; 
            }

            const response = await axios.post(url, { email, password });

            if (response.data.message === "exist") {
                const { userId, name } = response.data;
                console.log("Login successful, userId:", userId, "Role:", role);

                localStorage.setItem('name', name);
                localStorage.setItem('userId', userId);
                localStorage.setItem('email', email);
                localStorage.setItem('role', role);

                if (role === "user") {
                    navigate("/user/home", { state: { userId } });
                } else if (role === "company") {
                    navigate("/company/home", { state: { userId } });
                } else if (role === "placement") {
                    navigate("/placement/home", { state: { userId } });
                }
            } else if (response.data.message === "notexist") {
                alert("User has not signed up.");
            } else if (response.data.message === "fail") {
                alert("Incorrect password. Please try again.");
            }
        } catch (error) {
            alert("Login failed. Please try again.");
            console.error("Login error:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">COLLEGE PLACEMENT</h1>
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">LOGIN PAGE</h3>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="user">User</option>
                        <option value="company">Company</option>
                        <option value="placement">Placement Office</option>
                    </select>
                    
                    <input
                        type="submit"
                        value="LOGIN"
                        className="w-full bg-green-500 text-white py-2 hover:bg-green-600 transition duration-300"
                    />
                    
                </form>

                <p className="text-center text-gray-500 my-4">OR</p>
                <Link to="/sign">
                    <button className="w-full bg-blue-500 text-white py-2 hover:bg-blue-600 transition duration-300">
                        SIGNUP PAGE
                    </button>
                </Link>

                <div className="text-center mt-4">
                    <Link to="/forgot" className="text-blue-500 hover:text-blue-700">
                        Forgot Password?
                    </Link>
                </div>
            </div>
        </div>
    );
};
