import React,{ useState } from "react";
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegister(prev => ({
          ...prev,
          [name]: value,
        }));

        if (name === "username") {
            checkUsernameAvailability(value);
        }
    };

    const [isUsernameTaken, setIsUsernameTaken] = useState(false);
    const [usernameError, setUsernameError] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [registrationFlag, setMessage] = useState('');


    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();
        

        if (register.username && register.password && register.confirmPassword) {
            if (register.password === register.confirmPassword) {
                const { username, password, confirmPassword } = register;

                console.log("Username:", username);
                console.log("Password:", password);
                console.log("Confirm Password:", confirmPassword);

                if (isUsernameTaken) {
                    setMessage('This username is already taken. Please choose another one.');
                    setIsSuccess(false);
                    return; 
                }

                axios.post("http://" + window.location.host + "/register", {username, password, confirmPassword})
                .then(result => {console.log(result)
                    setMessage('Registration successful!');
                    setIsSuccess(true);

                    setTimeout(() => {
                    navigate('/login');
                    }, 2000);
                    })
                .catch(err => {console.log(err)
                    if (err.response && err.response.data.error === 'Username already taken') {
                        setIsUsernameTaken(true);
                        setUsernameError('This username is already taken.');
                    } else {
                        setMessage('Registration failed. Please try again.');
                        setIsSuccess(false);
                    }
            })
            }    

            else {
            
                setMessage('Passwords do not match!');
                setIsSuccess(false);
            }
        
        }
        else{
            setMessage('Please fill in all fields.');
            setIsSuccess(false);;
            
        }
}

const checkUsernameAvailability = async (username) => {
    if (username != null) { 
        try {
            const response = await axios.get("http://" + window.location.host + "/user-exist", { username });
            if (response.data.exists) {
                setIsUsernameTaken(true); 
                setUsernameError("Username is already taken");
            } else {
                setIsUsernameTaken(false); 
                setUsernameError("");
            }
        } catch (error) {
            console.error("Error checking username availability", error);
        }
    } 
};
    
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
