import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Crypto from "./pages/Crypto";
import Blog from "./pages/Blog";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Postblog from "./pages/Postblog";
import Protected from "./components/Protected";
import Error from "./pages/Error";
import { useSelector } from "react-redux";
import BlogDetails from "./pages/BlogDetails";
import BlogUpdate from "./pages/BlogUpdate";
import UseAutoLogin from "./hooks/UseAutoLogin";
import Loader from "./components/Loader";

function App() {
  const isAuth = useSelector((state) => state.user.auth);
  const loading = UseAutoLogin()
  return loading ? <Loader text={""} /> : (
    <>
      <BrowserRouter>
     <main className="bg-white text-black">
     <Header/>
      <Routes>
         <Route path="/" element={<Home/>} />
         <Route path="/crypto" element={<Crypto/>}/>
         <Route path="/Blog" element={ <Protected isAuth={isAuth}><Blog/></Protected>}/>
         <Route path="/Blog/:id" element={ <Protected isAuth={isAuth}><BlogDetails/></Protected>}/>
         <Route path="/Blog-update/:id" element={ <Protected isAuth={isAuth}><BlogUpdate/></Protected>}/>
         <Route path="/postblog" element={<Protected isAuth={isAuth}><Postblog/></Protected>}/>
         <Route path="/login"  element={<Login/>}/>
         <Route path="/signup" element={<Signup/>}/>
         <Route path="/logout" element={<div>Logout page</div>}/>
         <Route path="*" element={<Error/>}/>
      </Routes>
      <Footer/>
    
     </main>
      </BrowserRouter>
    </>
  );
}

export default App;
