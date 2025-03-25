import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminAuth from "./AdminAuth";
import AdminDashboard from "./adminDashBoard";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/login" element={<AdminAuth type="login" />} />
                <Route path="/admin/register" element={<AdminAuth type="register" />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />

                {/* Placeholder routes for book actions */}
                <Route path="/admin/books" element={<h2 className="text-center mt-20 text-2xl">List All Books (Coming Soon)</h2>} />
                <Route path="/admin/update-book" element={<h2 className="text-center mt-20 text-2xl">Update Book Details (Coming Soon)</h2>} />
                <Route path="/admin/delete-book" element={<h2 className="text-center mt-20 text-2xl">Delete Book (Coming Soon)</h2>} />
                <Route path="/admin/add-book" element={<h2 className="text-center mt-20 text-2xl">Add New Book (Coming Soon)</h2>} />
            </Routes>
        </Router>
    );
}

export default App;
