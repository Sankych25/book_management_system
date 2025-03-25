
import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { TextField } from "@mui/material";
import { Card, CardContent } from "./Card";

export default function AddBook() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [editingBook, setEditingBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:5000/api/books");
    setBooks(response.data);
  };

  const handleAddBook = async () => {
    if (!title || !author) return;
    await axios.post("http://localhost:5000/api/books", { title, author });
    setTitle("");
    setAuthor("");
    fetchBooks();
  };

  const handleDeleteBook = async (id) => {
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    fetchBooks();
  };

  const handleEditBook = async () => {
    if (!editingBook) return;
    await axios.put(`http://localhost:5000/api/books/${editingBook._id}`, {
      title: editingBook.title,
      author: editingBook.author,
    });
    setEditingBook(null);
    fetchBooks();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Book Management Dashboard</h1>
        <Button variant="contained" color="secondary" onClick={() => console.log("Logout")}>Logout</Button>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Add a New Book</h2>
        <div className="flex space-x-4">
          <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
          <TextField label="Author" value={author} onChange={(e) => setAuthor(e.target.value)} fullWidth />
          <Button variant="contained" color="primary" onClick={handleAddBook}>Add</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {books.map((book) => (
          <Card key={book._id} className="p-4 shadow-md">
            <CardContent>
              {editingBook && editingBook._id === book._id ? (
                <>
                  <TextField value={editingBook.title} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })} fullWidth />
                  <TextField value={editingBook.author} onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })} fullWidth />
                  <Button variant="contained" color="success" onClick={handleEditBook}>Save</Button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="text-gray-600">{book.author}</p>
                  <div className="flex space-x-2 mt-2">
                    <Button variant="outlined" color="primary" onClick={() => setEditingBook(book)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteBook(book._id)}>Delete</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
