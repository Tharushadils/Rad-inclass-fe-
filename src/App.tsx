// import { BrowserRouter, Routes,Route } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import Home from "./pages/Home";

import AuthProvider from "./Context/AuthContext"
import Router from "./router"


function App() {
  return <AuthProvider><Router /></AuthProvider>}

export default App