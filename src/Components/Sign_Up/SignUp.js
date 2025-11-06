import React, { useState } from 'react';
import './Sign_Up.css';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';

// Function component for Sign Up form
const SignUp = () => {
    // State variables for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    // Specific Error States
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [generalError, setGeneralError] = useState('');

    const navigate = useNavigate(); // Navigation hook from react-router

    // --- CHANGE 1: Handler for Name input ---
    // Clears the error as the user types
    const handleNameChange = (e) => {
        setName(e.target.value);
        if (nameError) {
            setNameError('');
        }
    };

    // --- CHANGE 2: Handler for Phone input ---
    // This function ensures only digits can be entered
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Use regex to remove any non-digit characters
        const onlyDigits = value.replace(/\D/g, '');
        setPhone(onlyDigits);

        if (phoneError) {
            setPhoneError('');
        }
    };

    // --- (Optional) Handler for Email/Password to clear errors on change ---
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (emailError) {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (passwordError) {
            setPasswordError('');
        }
    };

    // Function to handle form submission
    const register = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // --- CHANGE 3: Client-side validation ---
        // Clear all previous errors
        setNameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setGeneralError('');

        // Flag to check if form is valid
        let isValid = true;

        // Rule: Name must be more than 2 letters
        if (name.length <= 2) {
            setNameError("Name must be more than 2 characters long.");
            isValid = false;
        }

        // (Optional) You could add more checks here, e.g.,
        if (phone.length !== 10) {
            setPhoneError("Phone number must be 10 digits.");
            isValid = false;
        }
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            isValid = false;
        }

        // If the form is not valid, stop the submission
        if (!isValid) {
            return;
        }
        // --- End of validation ---


        // API Call to register user
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                phone: phone,
            }),
        });

        const json = await response.json(); // Parse the response JSON

        if (json.authtoken) {
            // ... (rest of your success logic) ...
            sessionStorage.setItem("auth-token", json.authtoken);
            sessionStorage.setItem("name", name);
            sessionStorage.setItem("phone", phone);
            sessionStorage.setItem("email", email);
            navigate("/");
            window.location.reload();
        } else {
            // Handle API errors
            if (json.errors) {
                for (const error of json.errors) {
                    if (error.param === 'name') {
                        setNameError(error.msg);
                    } else if (error.param === 'email') {
                        setEmailError(error.msg);
                    } else if (error.param === 'phone') {
                        setPhoneError(error.msg);
                    } else if (error.param === 'password') {
                        setPasswordError(error.msg);
                    } else {
                        setGeneralError(error.msg);
                    }
                }
            } else if (json.error) {
                setGeneralError(json.error);
            } else {
                setGeneralError("An unknown error occurred. Please try again.");
            }
        }
    };

    // JSX to render the Sign Up form
    return (
        <div className="container" style={{ marginTop: '5%' }}>
            <div className="signup-grid">
                {/* ... (your existing header/link JSX) ... */}
                <div className="signup-text">
                    <h2>Sign Up</h2>
                </div>
                <div className="signup-text">
                    Do you have an account?
                    <span>
                        <Link to="/login" style={{ color: '#2190FF' }}>
                            &nbsp;Log in Here
                        </Link>
                    </span>
                </div>

                <div className="signup-form">
                    <form method="POST" onSubmit={register}>
                        
                        {generalError && <div className="err" style={{ color: 'red', marginBottom: '10px' }}>{generalError}</div>}

                        {/* --- CHANGE 4: Updated 'onChange' handlers --- */}

                        {/* Name Field */}
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input value={name} onChange={handleNameChange} type="text" name="name" id="name" className="form-control" placeholder="Enter your name" aria-describedby="helpId" />
                            {nameError && <div className="err" style={{ color: 'red' }}>{nameError}</div>}
                        </div>

                        {/* Email Field */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input value={email} onChange={handleEmailChange} type="email" name="email" id="email" className="form-control" placeholder="Enter your email" aria-describedby="helpId" />
                            {emailError && <div className="err" style={{ color: 'red' }}>{emailError}</div>}
                        </div>

                        {/* Phone Field */}
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input value={phone} onChange={handlePhoneChange} type="tel" name="phone" id="phone" className="form-control" placeholder="Enter your phone number" aria-describedby="helpId" />
                            {phoneError && <div className="err" style={{ color: 'red' }}>{phoneError}</div>}
                        </div>

                        {/* Password Field */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input value={password} onChange={handlePasswordChange} type="password" name="password" id="password" className="form-control" placeholder="Enter your password" aria-describedby="helpId" />
                            {passwordError && <div className="err" style={{ color: 'red' }}>{passwordError}</div>}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{marginTop: '10px', width: '100%'}}>Sign Up</button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUp;