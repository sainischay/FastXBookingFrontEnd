import axios from 'axios';
import React, { useState, useEffect } from 'react';
import UserCreationCRUD from '../UserCreationCRUD';
import { jwtDecode } from 'jwt-decode' 
import './Login.css'
import { Link ,useNavigate} from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [authToken, setAuthToken] = useState(null); 
  const token = sessionStorage.getItem('authToken')
  const role = sessionStorage.getItem('role')
  const userId = sessionStorage.getItem('userId')
  const navigate=useNavigate();

  useEffect(()=>{
    if(token && role =='User'){
      navigate('/fromAndTo')
      return
    }
    else if(token && role =='Bus Operator'){
      navigate('/busOperatorDetails')
      return
    }
    else if(token && role =='Admin'){
      navigate(`/busdetails/${userId}`)
      return
    }
  })
  const loginFunc = async (event) => {
    event.preventDefault();
    console.log(role)
   
    if(username==''||password==''){
      setErrorMessage("Please fill the credentials")
      return
    }

    try {
      const response = await axios.post('https://localhost:7114/api/Token', {
        email: username,
        password: password
      });
      // console.log(response.data)
      if (response.status === 200) {
        const token = response.data;
        const decodedToken = jwtDecode(token);
        console.log(decodedToken)
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('userId',decodedToken.UserId)
        sessionStorage.setItem('userName',decodedToken.Name)
        sessionStorage.setItem('email',decodedToken.Email)
        sessionStorage.setItem('role',decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        // console.log(decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])
        if (decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']==='Bus Operator') {
          
          setAuthToken(token); 
          setErrorMessage('');
          navigate(`/busdetails/${decodedToken.UserId}`)
        } 
        else if (decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']==='User') {
          
          setAuthToken(token); 
          setErrorMessage('');
          navigate("/fromandto")
        } 
        else if (decodedToken && decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']==='Admin') {
         
          setAuthToken(token); 
          setErrorMessage('');
          navigate("/busOperatorDetails")
        } 
        else {
          setErrorMessage('You are not authorized to access this Api.');
        }
      } 
    } 
    catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data)}
      else{
        window.alert(error)}
    }
  };

  const logoutFunc = () => {
    sessionStorage.removeItem('authToken'); 
    setIsLoggedIn(false);
    setAuthToken(null); 
  };

  // if (isLoggedIn) {
  //   return (
  //     <div>
  //       <UserCreationCRUD newCred={authToken} />
  //       <button className="btn btn-danger" onClick={logoutFunc}>
  //         Logout
  //       </button>
  //     </div>
  //   );
  // }


  return (
    <div className="container">
            <section className="myform-area">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="form-area login-form">
                                <div className="form-content">
                                    <h2>Login</h2>
                                    <p>You choose the right option</p>
                                </div>
                                <div className="form-input">
                                    <h2>Enter Credentials</h2>
                                    <form >
                                        <div className="form-group">
                                            <input className="loginInfo" type="text" name="name" autoComplete="off" value={username} 
            onChange={(e)=>setUsername(e.target.value)} required />
                                            <label>Email</label>
                                        </div>
                                        <div className="form-group">
                                            <input className="loginInfo" type="password" name="password" autoComplete="off" value={password} 
            onChange={(e)=>setPassword(e.target.value)} required />
                                            <label>Password</label>
                                        </div>
                                        <br></br>
                                        {errorMessage && (
                                                <div className="alert alert-danger">
                                                {errorMessage}
                                                </div>
                                        )}
                                        <div className="myform-button">
                                            {/* <Link to="/details"> */}
                                            <button onClick={loginFunc} type="submit" className="myform-btn">Login</button >
                                            {/* </Link> */}
                                        </div>
                                        <div>
                                            <small className="form-text text-muted signup-text">Don't have an Account? <Link to="/registerUser">Sign Up</Link>
                                            </small>
                                            {/* <span className="signUPtext"><a href="/#" onClick={(e) => getToSignUp(e)}>Sign-Up</a></span> */}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div >

  );
};

export default Login;
