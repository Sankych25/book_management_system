import { useNavigate } from "react-router-dom";
import { logout } from "../api/api";

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/admin/login");
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">📚 Admin Dashboard</h2>
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => navigate("/admin/books")} className="bg-gray-600 text-white p-3 rounded">List All Books</button>
                <button onClick={() => navigate("/admin/add-book")} className="bg-green-600 text-white p-3 rounded">Add New Book</button>
                <button onClick={() => navigate("/admin/update-book")} className="bg-yellow-500 text-white p-3 rounded">Update Book</button>
                <button onClick={() => navigate("/admin/delete-book")} className="bg-red-500 text-white p-3 rounded">Delete Book</button>
            </div>
            <button onClick={handleLogout} className="mt-6 bg-black text-white p-2 rounded">Logout</button>
        </div>
    );
};

export default Dashboard;
