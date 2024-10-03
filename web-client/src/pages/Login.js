import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Login() {
    const [login, setLogin] = useState ({
        username:'',
        password:'',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login.username !== "" && login.password !== "") {
            
        }
        }

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
                        <input type="text" className="form-control" id="username-input" placeholder="username" 
                        name = "username" onChange={handleChange}/>
                        <label htmlFor="username-input">Username</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" id="password-input" placeholder="password"
                         name = "password" onChange={handleChange}/>
                        <label htmlFor="password-input">Password</label>
                    </div>
                    <p>Not a member? <Link to="/register">Register</Link></p>
                    <button  type="button" className="btn btn-outline-success btn-block mb-4">Sign in</button>
                    
                    </form>
                </div>
                <div className="col">
                
                </div>
            </div>
        </div>
        </> 
    )
}

export default Login;