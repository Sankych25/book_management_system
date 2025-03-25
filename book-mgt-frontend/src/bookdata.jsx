import { useEffect, useState } from "react";

export default function UserTable() {
  const [users, setUsers] = useState([]);

  // Fetch users from API
  useEffect(() => {
    fetch("http://localhost:5000/api/users") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add user
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2 text-gray-600">{user.title}</td>
                <td className="px-4 py-2 text-gray-600">{user.email}</td>
                <td className="px-4 py-2 text-gray-600">{user.role}</td>
                <td className="px-4 py-2">
                  <button className="text-indigo-600 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
