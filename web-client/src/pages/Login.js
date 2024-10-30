import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios'


function Login() {
    const [login, setLogin] = useState ({
        username:'',
        password:'',
    });


    const [isSuccess, setIsSuccess] = useState(false);
    const [canLogin, setCanLogIn] = useState('');

    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const params = {
            username:login.username,
            password:login.password,
        }
        
        if( login.username !== '' && login.password !== ''){
            try {
                const response = await axios.get("http://" + window.location.host + "/api/login", { params });
      
                if (response.data.message === 'Login successful!') {
                    //add user to local storage
                    localStorage.setItem("user", login.username)
                    setCanLogIn("Login Successful")
                    setIsSuccess(true)
                    setTimeout(() => {
                    navigate('/');
                    }, 2000); 
                }
              } catch (err) {
                  console.error('Error during login:', err.response ? err.response.data : err.message);
                  setCanLogIn("Username or password do not match")
                  setIsSuccess(false)
              }
        } else {
            setCanLogIn("Please enter username and password.")
            setIsSuccess(false)
        }
        
      };
      
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin(prev => ({
          ...prev,
          [name]: value,
        }));
    };

    return(
        <>
        <Navbar />
        <div className="container text-left">
            <div className="row">
                <div className="col">
                </div>
                <div className="col">
                    <h5 className="p-3">Please Log into your Account</h5>
                    <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input data-testid="l_username" type="text" className="form-control" id="username-input" placeholder="username" 
                        name = "username" onChange={handleChange}/>
                        <label htmlFor="username-input">Username</label>
                    </div>

                    <div className="form-floating">
                        <input data-testid="l_password" type="password" className="form-control" id="password-input" placeholder="password"
                         name = "password" onChange={handleChange}/>
                        <label htmlFor="password-input">Password</label>
                    </div>
                    <p>Not a member? <Link to="/register">Register</Link></p>
                    <button  type="Submit" className="btn btn-outline-success btn-block mb-4">Sign in</button>
              
                    </form>

                    {canLogin && (
                        <div style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: isSuccess ? 'green' : 'red',
                        color: 'white',
                    }}>
                      {canLogin}
                 </div>
                    )}
                    
                </div>
                <div className="col">
                
                </div>
            </div>
        </div>
        </> 
    )
}

export default Login;