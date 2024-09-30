import React,{ useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Register() {
    const [register, setRegister] = useState ({
        username:'',
        password:'',
        confirmPassword:''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegister(prev => ({
          ...prev,
          [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (register.username !== "" && register.password !== "" 
            && register.password == register.confirmPassword) 
        {
            
        }
    }
    
    return(
        <>
        <Navbar />
        <div className="container text-left">
            <div className="row">
                <div className="col">
                </div>
                <div className="col">
                    <h5 className="p-3">Please fill in the information to Register</h5>
                    <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input type="text" className="form-control" id="new-username-input" placeholder="username"
                        name="username" onChange={handleChange}/>
                        <label for="new-username-input">Username</label>
                    </div>

                    <div className="form-floating mb-3">
                        <input type="password" className="form-control" id="new-password-input" placeholder="password"
                        name="password" onChange={handleChange}/>
                        <label for="new-password-input">Password</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" id="repeat-password-input" placeholder="password"
                        name="confirmPassword" onChange={handleChange}/>
                        <label for="repeat-password-input">Confirm Password</label>
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
