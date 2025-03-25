import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBooks, updateBook } from "../api/api";

const UpdateBook = () => {
    const { id } = useParams(); // Get book ID from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        publishedDate: "",
    });

    useEffect(() => {
        async function fetchBookDetails() {
            try {
                const response = await getBooks();
                const book = response.data.find((b) => b._id === id);
                if (book) {
                    setFormData({
                        title: book.title,
                        author: book.author,
                        publishedDate: book.publishedDate.split("T")[0], // Format date
                    });
                } else {
                    alert("Book not found!");
                    navigate("/admin/books");
                }
            } catch (error) {
                alert("Error fetching book details");
            }
        }
        fetchBookDetails();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBook(id, formData);
            alert("Book updated successfully!");
            navigate("/admin/books"); // Redirect to book list
        } catch (error) {
            alert("Error updating book");
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">✏️ Update Book Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Book Title"
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    placeholder="Author Name"
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="date"
                    name="publishedDate"
                    value={formData.publishedDate}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <button type="submit" className="bg-yellow-500 text-white p-2 rounded">
                    Update Book
                </button>
            </form>
        </div>
    );
};

export default UpdateBook;
