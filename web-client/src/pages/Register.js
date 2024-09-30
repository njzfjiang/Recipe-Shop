import React,{ useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Register() {

    return(
        <>
        <Navbar />
        <div className="container text-left">
            <div className="row">
                <div className="col">
                </div>
                <div className="col">
                    <h5 className="p-3">Please fill in the information to Register</h5>
                    <form>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="new-username-input" placeholder="username"/>
                        <label for="new-username-input">Username</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="new-password-input" placeholder="password"/>
                        <label for="new-password-input">Password</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" id="repeat-password-input" placeholder="password"/>
                        <label for="repeat-password-input">Repeat Password</label>
                    </div>

                    <p>Already a member? <Link to="/login">Sign in</Link></p>
                    <button  type="Submit" className="btn btn-outline-success btn-block mb-4">Register</button> 
                    </form>
                </div>
                <div className="col">
                
                </div>
            </div>
        </div>
        </> 
    )
}

export default Register;
