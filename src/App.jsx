import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar"; 
import Home from "./components/Home";
import About from "./components/About";
import ContactUs from "./components/ContactUs";
import KnowMore from "./components/KnowMore";
import Faq from "./components/Faq";
import "./components/Footer.css";
import "./components/Home.css"
import "./components/Navbar.css";
import UploadVid from "./components/UploadVid";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/faqs" element={<Faq />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/know-more" element={<KnowMore />} />
          <Route path="/upload-video" element={<UploadVid />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
