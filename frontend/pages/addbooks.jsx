import { useState } from "react";
import { addBook } from "../api/api";

const AddBook = () => {
    const [formData, setFormData] = useState({ title: "", author: "", publishedDate: "" });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addBook(formData);
            alert("Book added successfully!");
        } catch (error) {
            alert("Error adding book");
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">➕ Add New Book</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" placeholder="Book Title" className="border p-2 w-full" onChange={handleChange} required />
                <input type="text" name="author" placeholder="Author Name" className="border p-2 w-full" onChange={handleChange} required />
                <input type="date" name="publishedDate" className="border p-2 w-full" onChange={handleChange} required />
                <button type="submit" className="bg-green-600 text-white p-2 rounded">Add Book</button>
            </form>
        </div>
    );
};

export default AddBook;
