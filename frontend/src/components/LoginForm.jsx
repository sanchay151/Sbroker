import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/PortStock';
import { useNavigate } from "react-router-dom";
import Spner from './Spner';
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [signupMessage, setSignupMessage] = useState("");
  const [loading,setLoading]=useState(false);

  // Separate states for login and signup
  const [signupFormData, setSignupFormData] = useState({
    name: "",
    phoneNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  // Toggle between login and signup
  const toggleForm = () => setIsSignup((prev) => !prev);

  // Handle input changes for login form
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle input changes for signup form
  const handleSignupInputChange = (e) => {
    const { name, value } = e.target;
    setSignupFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginMessage("");
    const loginInfo = {
      email: loginFormData.email,
      userpassword: loginFormData.password,
    };

    try {
      setLoading(true);
      const url = "https://sbroker-backend.vercel.app/api/v1/user/login";
      const res = await axios.post(url, loginInfo, { withCredentials: true });

      if (res.status === 200) {
        const { user, token } = res.data;
        dispatch(setUser(user));
        setLoading(false);
        localStorage.setItem("authToken", token);
        setLoginMessage("Login Successful!");
        navigate("/main")

      }
    } catch (error) {
      setLoginMessage(
        error.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  // Signup handler
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignupMessage("");
   
    // Validation for password confirmation
    if (signupFormData.password !== signupFormData.confirmPassword) {
      setSignupMessage("Passwords do not match!");
      return;
    }
    setLoading(true);

    const signupInfo = {
      Name: signupFormData.name,
      phoneNumber: signupFormData.phoneNo,
      email: signupFormData.email,
      userpassword: signupFormData.password,
      confirmuserpassword: signupFormData.confirmPassword,
    };

    try {
      const url = "https://sbroker-backend.vercel.app/api/v1/user/signup";
      const res = await axios.post(url, signupInfo, { withCredentials: true });

      if (res.status === 200) {
        setSignupMessage("Signup Successful!");
        setLoading(false);

        setTimeout(() => setIsSignup(false), 1000); // Switch to login form after signup
      }
    } catch (error) {
      setSignupMessage(
        
        error.response?.data?.message || "An unexpected error occurred. Please try again."
      );
    }
  };
  const fphandler =()=>{
    navigate("/forgot-password");
  };

  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="card-switch">
          <label className="switch">
            <input
              type="checkbox"
              className="toggle"
              checked={isSignup}
              onChange={toggleForm}
            />
            <span className="slider" />
            <span className="card-side" />
            <div className="flip-card__inner">
              {/* Login Form */}
              <div className="flip-card__front">
                <div className="title">Log in</div>
                {loginMessage && <p className="error-message">{loginMessage}</p>}
                <form className="flip-card__form" onSubmit={handleLogin}>
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={loginFormData.email}
                    onChange={handleLoginInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={loginFormData.password}
                    onChange={handleLoginInputChange}
                  />
                  <div className='flex flex-row'>
                  <button className="flip-card__btn" type="submit">
                    Let`s go!
                  </button>
                  {loading && <Spner/>}
                  </div>
                  
                </form>
                < button className='forgot-password' onClick={fphandler}>Forgot Password</button>
              </div>

              {/* Signup Form */}
              <div className="flip-card__back">
                <div className="title">Sign up</div>
                {signupMessage && <p className="error-message">{signupMessage}</p>}
                <form className="flip-card__form" onSubmit={handleSignUp}>
                  <input
                    className="flip-card__input"
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={signupFormData.name}
                    onChange={handleSignupInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="phoneNo"
                    placeholder="Phone Number"
                    type="text"
                    value={signupFormData.phoneNo}
                    onChange={handleSignupInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={signupFormData.email}
                    onChange={handleSignupInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="password"
                    placeholder="Password"
                    type="password"
                    value={signupFormData.password}
                    onChange={handleSignupInputChange}
                  />
                  <input
                    className="flip-card__input"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type="password"
                    value={signupFormData.confirmPassword}
                    onChange={handleSignupInputChange}
                  />
                  <div className='flex flex-row gap-4'>
                  <button className="flip-card__btn" type="submit">
                    Confirm!
                    {loading && <Spner/>}
                  </button>
                  </div>
                  
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .wrapper {
    --input-focus: #2d8cf0;
    --font-color: #504e4d;
    --font-color-sub: #666;
    --bg-color: #fff;
    --bg-color-alt: #666;
    --main-color: #323232;
      /* display: flex; */
      /* flex-direction: column; */
      /* align-items: center; */
  }
      .error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.success-message {
  color: green;
  font-size: 14px;
  margin-top: 10px;
}

  /* switch card */
  .switch {
    transform: translateY(-200px);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 50px;
    height: 20px;
  }

  .card-side::before {
    position: absolute;
    content: 'Log in';
    left: -70px;
    top: 0;
    width: 100px;
    text-decoration: underline;
    color: var(--font-color);
    font-weight: 600;
  }

  .card-side::after {
    position: absolute;
    content: 'Sign up';
    left: 70px;
    top: 0;
    width: 100px;
    text-decoration: none;
    color: var(--font-color);
    font-weight: 600;
  }

  .toggle {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    box-sizing: border-box;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--bg-colorcolor);
    transition: 0.3s;
  }

  .slider:before {
    box-sizing: border-box;
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    border: 2px solid var(--main-color);
    border-radius: 5px;
    left: -2px;
    bottom: 2px;
    background-color: var(--bg-color);
    box-shadow: 0 3px 0 var(--main-color);
    transition: 0.3s;
  }

  .toggle:checked + .slider {
    background-color: var(--input-focus);
  }

  .toggle:checked + .slider:before {
    transform: translateX(30px);
  }

  .toggle:checked ~ .card-side:before {
    text-decoration: none;
  }

  .toggle:checked ~ .card-side:after {
    text-decoration: underline;
  }

  /* card */ 

  .flip-card__inner {
    width: 300px;
    height: 350px;
    position: relative;
    background-color: transparent;
    perspective: 1000px;
      /* width: 100%;
      height: 100%; */
    text-align: center;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .toggle:checked ~ .flip-card__inner {
    transform: rotateY(180deg);
  }

  .toggle:checked ~ .flip-card__front {
    box-shadow: none;
  }

  .flip-card__front, .flip-card__back {
    padding: 20px;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    background: lightgrey;
    gap: 20px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    box-shadow: 4px 4px var(--main-color);
  }

  .flip-card__back {
    width: 100%;
    transform: rotateY(180deg);
  }

  .flip-card__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  .title {
    margin: 20px 0 20px 0;
    font-size: 25px;
    font-weight: 900;
    text-align: center;
    color: var(--main-color);
  }
    .forgot-password {
    margin: 8px 0 8px 0;
    font-size: 16px;
    font-weight: 700;
    text-align: left;
    color: var(--main-color);
    
  }

  .flip-card__input {
    width: 250px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 15px;
    font-weight: 600;
    color: var(--font-color);
    padding: 5px 10px;
    outline: none;
  }

  .flip-card__input::placeholder {
    color: var(--font-color-sub);
    opacity: 0.8;
  }

  .flip-card__input:focus {
    border: 2px solid var(--input-focus);
  }

  .flip-card__btn:active, .button-confirm:active {
    box-shadow: 0px 0px var(--main-color);
    transform: translate(3px, 3px);
  }

  .flip-card__btn {
    margin: 20px 0 20px 0;
    width: 120px;
    height: 40px;
    border-radius: 5px;
    border: 2px solid var(--main-color);
    background-color: var(--bg-color);
    box-shadow: 4px 4px var(--main-color);
    font-size: 17px;
    font-weight: 600;
    color: var(--font-color);
    cursor: pointer;
  }`;

export default LoginForm;
