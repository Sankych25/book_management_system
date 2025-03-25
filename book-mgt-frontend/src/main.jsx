import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Example from './NavBar.jsx'
// import BookDetails from './bookdetails.jsx'
// import UserTable from './bookdata.jsx'
import Login from './login.jsx'
//import adminNav from './navBar.jsx'
import { BrowserRouter } from 'react-router-dom';
// import  Register  from './Register.jsx';
import Table from "./AddBook.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    {/* <App /> */}
    <Table/>
    </BrowserRouter>
    

  </StrictMode>,
)
