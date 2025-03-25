import { useState } from "react";
import { login } from "../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: ""});
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            alert("Login Successful");
            navigate("/admin/dashboard");
        } catch (error) {
            alert("Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
                <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
                <input type="email" name="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" className="border p-2 w-full mb-2" onChange={handleChange} required />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">Login</button>
            </form>
        </div>
    );
};

export default Login;
