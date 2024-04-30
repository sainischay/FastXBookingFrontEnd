import { useState } from "react";
import axios from 'axios'; 
import './RegisterUser.css';
import { Link, useNavigate ,useParams} from "react-router-dom"; 

function RegisterUser() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const validatePhoneNumber = (phoneNumber) => {
        const regex = /^[789]\d{9}$/;
        return regex.test(phoneNumber);
    };


    const validateGender = (gender) => {
        return gender === "Male" || gender === "Female";
    };
    
    
    const UserDetails= async (event)=> {
        event.preventDefault();
        if (!validatePhoneNumber(contactNumber)) {
            setErrorMessage('Phone number should be 10 digits and should start with either 7, 8, or 9.');
            return;
        }

        
        if (!validateGender(gender)) {
            setErrorMessage('Gender should be either "Male" or "Female".');
            return;
        }

    try{
        const response = await axios.post('https://localhost:7114/api/Users',{
            name: name,
            email: email,
            password: password,
            address: address,
            gender: gender,
            contactNo: contactNumber
        })
        if(response.status==200){
            window.alert("Registration successful!");
            navigate("/login")
        }
    }
    catch(error){
        if(error.response.status==409){
            setErrorMessage('Account with this email already exists')
        }
        else if (error.response && error.response.data) {
            setErrorMessage(error.response.data);
          } else {
            console.log(error)
            setErrorMessage('An unexpected error occurred. Please try again.');
          }
    }
    }
    
    return (
        <div className="container">
            <section className="myform-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="form-area register-form">
                                <div className="form-content">
                                    <h2>Register</h2>
                                </div>
                                <div className="form-input">
                                    <h2>Enter Details</h2>
                                    <form>
                                        <div className="form-group">
                                            <input className="registerInfo" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                                            <label>Name</label>
                                        </div>
                                        
                                        <div className="form-group">
                                            <input className="registerInfo" type="email" name="email" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                            <label>Email</label>
                                        </div>

                                        <div className="form-group">
                                            <input className="registerInfo" type="password" name="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)}  required />
                                            <label>Password</label>
                                        </div>

                                        <div className="form-group">
                                            <input className="registerInfo" type="phone" name="contactNumber" autoComplete="off" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}  required/>
                                            <label>Contact Number</label>
                                        </div>

                                        <div className="form-group">
                                            <input className="registerInfo" type="text" name="gender" autoComplete="off" value={gender} onChange={(e) => setGender(e.target.value)} required />
                                            <label>Gender (Male/Female)</label>
                                        </div>
                                        <div className="form-group">
                                            <input className="registerInfo" type="text" name="address" autoComplete="off" value={address} onChange={(e) => setAddress(e.target.value)} required />
                                            <label>Address</label>
                                        </div>
                                        <br></br>
                                        {errorMessage && (
                                                <div className="alert alert-danger">
                                                {errorMessage}
                                                </div>
                                        )}

                                        <div className="myform-button">
                                            <button onClick={UserDetails} type="submit" className="myform-btn">Register</button>  
                                        </div>
                                        <div>
                                            <small className="form-text text-muted signup-text">Already have an Account? <Link to="/login">Login</Link>
                                            </small>
                                            
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </section>
        </div>
    );
}


export default RegisterUser;
