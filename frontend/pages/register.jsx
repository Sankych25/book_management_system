import { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            alert("Registration successful! You can now log in.");
            navigate("/admin/login"); // Redirect to login page
        } catch (error) {
            alert("Error registering admin: " + error.response?.data?.message || "Server error");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded w-96">
                <h2 className="text-2xl font-bold mb-4">📝 Admin Registration</h2>
                
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="border p-2 w-full mb-2"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="border p-2 w-full mb-2"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="border p-2 w-full mb-2"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="border p-2 w-full mb-2"
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="bg-blue-600 text-white p-2 rounded w-full">
                    Register
                </button>

                <p className="text-sm text-gray-600 mt-2">
                    Already have an account? 
                    <a href="/admin/login" className="text-blue-500 ml-1">Login here</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
