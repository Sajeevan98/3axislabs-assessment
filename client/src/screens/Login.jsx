import React, { useState } from 'react';
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import API from '../config/Api';

const Login = ({onLogin}) => {
   const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(true);

    const handleSubmission = async (e) => {

        e.preventDefault();
        try {
            const response = await API.post('/login', { username, password });

            const jwtToken = response.data.jwtToken;
            const roles = response.data.roles;
            const role = roles.includes('ROLE_ADMIN') ? 'admin' : 'user';

            localStorage.setItem('jwtToken', jwtToken);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('roles', JSON.stringify(roles));
            localStorage.setItem('role', role);

            console.log(username, " - ", password)
            onLogin(role, jwtToken);

        } catch (err) {
            setError('Invalid username or password!');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-amber-500">Login</h2>
                {error && (
                    <p className="p-2 text-sm text-center text-red-600 bg-red-100 border border-red-300 rounded">
                        {error}
                    </p>
                )}
                <form className="space-y-4" onSubmit={handleSubmission}>
                    <div>
                        <label className="block mb-1 text-sm font-semibold text-gray-600">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-white focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block mb-1 text-sm font-semibold text-gray-600">
                            Password
                        </label>
                        <input
                            type={showPassword ? "password" : "text"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 text-sm border rounded-lg focus:outline-white  focus:ring-2 focus:ring-amber-400"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-11 right-3 flex items-center text-sm text-gray-500 hover:text-amber-500 cursor-pointer"
                        >
                            {showPassword ? <BiSolidHide size={18} /> : <BiSolidShow size={18} />}
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition duration-300 hover:cursor-pointer"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;