import React from "react";
import Navbar from "../components/Navbar";

function Login() {
    return(
        <>
        <Navbar />
        <div className="container text-left">
            <div className="row">
                <div className="col">
                </div>
                <div className="col">
                    <h5 className="p-3">Please Log into your Account</h5>
                    <form>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="username-input" placeholder="username"/>
                        <label for="username-input">Username</label>
                    </div>

                    <div className="form-floating">
                        <input type="text" className="form-control" id="password-input" placeholder="password"/>
                        <label for="password-input">Password</label>
                    </div>
                    <p>Not a member? <a href="#!">Register</a></p>
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