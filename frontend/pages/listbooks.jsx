import { useEffect, useState } from "react";
import { getBooks } from "../api/api";

const ListBooks = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await getBooks();
                setBooks(response.data);
            } catch (error) {
                alert("Error fetching books");
            }
        }
        fetchBooks();
    }, []);

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">📚 List of Books</h2>
            <ul>
                {books.map((book) => (
                    <li key={book._id} className="border p-2 mb-2">
                        <strong>{book.title}</strong> - {book.author} ({book.publishedDate})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListBooks;
