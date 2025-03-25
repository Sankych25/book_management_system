import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            <div className="grid grid-cols-2 gap-6">
                <button
                    onClick={() => navigate("/admin/books")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                    📚 List All Books
                </button>
                <button
                    onClick={() => navigate("/admin/update-book")}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
                >
                    ✏️ Update Book Details
                </button>
                <button
                    onClick={() => navigate("/admin/delete-book")}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-200"
                >
                    ❌ Delete Book
                </button>
                <button
                    onClick={() => navigate("/admin/add-book")}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200"
                >
                    ➕ Add New Book
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
