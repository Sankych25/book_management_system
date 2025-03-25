// import { useState } from 'react'


// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
    
//     </>
//   )
// }

// export default App
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./login";
import Register from "./Register";
// import Dashboard from "./pages/Dashboard";
// import AddBook from "./pages/AddBook";
// import EditBook from "./pages/EditBook";

// Protected Route Component
const PrivateRoute = () => {
  const token = localStorage.getItem("token"); // Check if user is authenticated
  return token ? <Outlet /> : <Navigate to="/" />; // Redirect to login if not authenticated
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/addBook" element={<AddBook />} />
        <Route path="/editBook/:id" element={<EditBook />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
