import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminAuth = ({ type }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        ...(type === "register" && { confirmPassword: "" }),
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (type === "register" && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        console.log(type === "register" ? "Registering Admin..." : "Logging in...");
        console.log(formData);

        // Mock authentication success
        navigate("/admin/dashboard"); // Redirect after successful login/register
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-96">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {type === "register" ? "Admin Register" : "Admin Login"}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {type === "register" && (
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        {type === "register" ? "Register" : "Login"}
                    </button>
                </form>
                <p className="text-center text-gray-600 mt-4">
                    {type === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
                    <span
                        className="text-blue-500 cursor-pointer"
                        onClick={() => navigate(type === "register" ? "/admin/login" : "/admin/register")}
                    >
                        {type === "register" ? "Login here" : "Register here"}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AdminAuth;
