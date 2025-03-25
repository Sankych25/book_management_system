import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./app.jsx";
import Register from "./pages/register.jsx";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import ListBooks from "./pages/listbooks.jsx";
import UpdateBook from "./pages/updatebook.jsx";
import AddBook from "./pages/addbooks.jsx";
import DeleteBook from "./pages/deletebook.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/admin/register" element={<Register />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/books" element={<ListBooks />} />
                <Route path="/admin/books/update/:id" element={<UpdateBook />} />
                <Route path="/admin/books/add" element={<AddBook />} />
                <Route path="/admin/books/delete/:id" element={<DeleteBook />} />
            </Routes>
        </Router>
    </React.StrictMode>
);
