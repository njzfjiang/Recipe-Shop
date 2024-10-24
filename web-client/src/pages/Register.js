import React,{ useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


function Register() {
    const [register, setRegister] = useState ({
        username:'',
        password:'',
        confirmPassword:''
    });
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [registrationFlag, setMessage] = useState('');
    const navigate = useNavigate()


    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegister(prev => ({
          ...prev,
          [name]: value,
        }));
    };

    useEffect(()=>{
        const checkUsernameAvailability = () => {
            try {
               axios.get("http://" + window.location.host + "/api/user-exist", 
                    { params: { username: register.username } })
                    .then((response)=>{
                        if (response.data.exists) {
                            setIsUsernameTaken(true); 
                            setUsernameError("Username is already taken");
                        } else {
                            setIsUsernameTaken(false); 
                            setUsernameError("");
                        }})
                    .catch((error)=> {
                        console.error("Error in axios request", error);
                    })
            } catch (error) {
                console.error("Error checking username availability", error);
            }
        
         };
         
        if(register.username !== ''){
            checkUsernameAvailability();
            setMessage('');
        }
    },[register.username])

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (register.username && register.password && register.confirmPassword) {
            if (register.password === register.confirmPassword) {
                
                if (isUsernameTaken) {
                    //username is taken
                    setMessage('This username is already taken. Please choose another one.');
                    setIsSuccess(false);
                    return; 
                } else {
                    //username is unique, send to server for registeration
                    const { username, password, confirmPassword } = register;
                    axios.post("http://" + window.location.host + "/api/register", {username, password, confirmPassword})
                    .then(result => {console.log(result)
                        setMessage('Registration successful!');
                        setIsSuccess(true);
                        //navigate to homepage
                        setTimeout(() => {
                        navigate('/login');
                        }, 2000);
                    })
                    .catch(err => {console.log(err)
                    if (err.response && err.response.data.error === 'Username already taken') {
                        setIsUsernameTaken(true);
                        setUsernameError('This username is already taken.');
                        //won't happen
                    } else {
                        setMessage('Registration failed. Please try again.');
                        setIsSuccess(false);
                    }})
                }

                
            } else {
                //password not matching!!
                setMessage('Passwords do not match!');
                setIsSuccess(false);
            }
        
        } else {
            //Not all fields filled in.
            setMessage('Please fill in all fields.');
            setIsSuccess(false);;
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
                        <input data-testid="r_username" type="text" className="form-control" id="new-username-input" placeholder="username"
                        name="username" onChange={handleChange}/>
                        <label htmlFor="new-username-input">Username</label>
                        {isUsernameTaken && <p style={{ color: 'red' }}>{usernameError}</p>}
                    </div>

                    <div className="form-floating mb-3">
                        <input data-testid="r_password"type="password" className="form-control" id="new-password-input" placeholder="password"
                        name="password" onChange={handleChange}/>
                        <label htmlFor="new-password-input">Password</label>
                    </div>

                    <div className="form-floating">
                        <input data-testid="repeat_password" type="password" className="form-control" id="repeat-password-input" placeholder="password"
                        name="confirmPassword" onChange={handleChange}/>
                        <label htmlFor="repeat-password-input">Confirm Password</label>
                    </div>

                    <p>Already a member? <Link to="/login">Sign in</Link></p>
                    <button  type="Submit" className="btn btn-outline-success btn-block mb-4">Register</button> 
                    </form>
                    {registrationFlag && (
                        <div style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: isSuccess ? 'green' : 'red',
                        color: 'white',
                    }}>
        {registrationFlag}
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

export default Register;
