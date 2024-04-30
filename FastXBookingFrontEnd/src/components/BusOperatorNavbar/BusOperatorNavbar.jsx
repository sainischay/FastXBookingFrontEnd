import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 
import './BusOperatorNavbar.css';
import Logo from "../Navbar/logo.png";
import LogoutImage from '../Navbar/logoutimage.png';

function BusOperatorNavbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem('authToken')); // Initialize login state based on token presence
    const navigate = useNavigate();
    const userId = sessionStorage.getItem('userId')

    const handleLogout = () => {
        sessionStorage.removeItem('authToken');
        setIsLoggedIn(false); 
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark">
            <div className="container-fluid">
            <Link to="/" className="navbar-brand d-flex align-items-center">
    <img src={Logo} alt="Logo" className="d-inline-block align-top" style={{ marginRight: '10px', height: '60px' }} />
    <span style={{ lineHeight: '60px' }}>Fast X Booking</span>
</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href={`/busDetails/${userId}`}>Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href={`/busDetails/${userId}`}>View Buses</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/addbus">Add Bus</a>
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

export default BusOperatorNavbar;
