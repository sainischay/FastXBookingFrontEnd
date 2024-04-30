import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import LogoutImage from './logoutimage.png';
import Logo from './logo.png'

function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('authToken'));
    const navigate=useNavigate();
    
    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        setIsLoggedIn(false);
        navigate('/login')
    };

    return (
        <nav className="navbar bg-dark navbar-expand-lg ">
            <div className="container-fluid">
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#navbarTogglerDemo01"
                    aria-controls="navbarTogglerDemo01"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <Link to="/" className="navbar-brand d-flex align-items-center">
    <img src={Logo} alt="Logo" className="d-inline-block align-top" style={{ marginRight: '10px', height: '60px' }} />
    <span style={{ lineHeight: '60px' }}>Fast X Booking</span>
</Link>
                        <li className="nav-item booking-history">
                            <Link to="/fromandto" className="nav-link">
                            <span style={{ lineHeight: '60px' }}>Book a Bus</span></Link>
                        </li>
                        <li className="nav-item booking-history">
                            <Link to="/bookinghistory" className="nav-link">
                            <span style={{ lineHeight: '60px' }}>Manage Bookings</span> </Link>
                        </li>
                    </ul>
                    <div className="d-flex align-items-center">
                        {isLoggedIn ? (
                            <button className="nav-link active logout-btn" onClick={handleLogout}>
                                <img src={LogoutImage} alt="Logout" className="logout-image" /><span>Logout</span>
                            </button>
                        ) : (
                            <Link className="nav-link active" to="/login">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
