import { Link } from "react-router-dom";
import './cssfiles/Navbar.css'; 
import family from "../assets/images/family.png"

const Navbar = () => {
  return (
    <div className="navout">
      <nav className="navbar fw-bold  navbar-expand-lg mynav ">
        <div className="container-fluid">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img 
              src={family}
              alt="logo"
              className="navbar-logo me-2"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border:'1px solid black'
              }}
            />
            <span className="fs-5 fw-semibold ">Joy With Learning</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/enquire">
                  Enquire
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/faqs">
                  FAQs
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact-us">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
