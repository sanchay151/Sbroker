import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const FPassword = ()=>{
   const navigate=useNavigate();
   const[FPmessage, setFPasswordmessage]=useState("");
   const [FPasswordData, setFPasswordData] = useState({
       email: "",
     });
     const handleFPasswordInputChange = (e) => {
      const { name, value } = e.target;
      setFPasswordData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
    const handleFPassword= async (e)=>{
      e.preventDefault();
      setFPasswordmessage("");
      const fp={
         email:FPasswordData.email
      }
      try {
         const url="https://sbroker-backend.vercel.app/api/v1/user/forgot-userpassword";
         const res=await axios.post(url,fp,{ withCredentials: true });
         console.log(res);
         console.log("yahan hai");
         setFPasswordmessage(res.data.message)
         console.log("yahan bhi hai")
         setTimeout(() => {
            navigate("/login");
         }, 6000);
      } catch (error) {
         console.log("yahan phuch gya")
         setFPasswordmessage(
           
            error.response?.data?.message || "An unexpected error occurred. Please try again."
         )
      }

    };
   return (
    <div className="mt-40 ml-80">  <StyledWrapper>
      <div className="wrapper">
         <div className="card-switch">
         <div className="flip-card__front">
        <div className="title">Enter Email For Reseting Password</div>
        {FPmessage && <p className="error-message">{FPmessage}</p>}
      <form className="flip-card__form" onSubmit={handleFPassword}>
    <input
      className="flip-card__input"
      name="email"
      placeholder="Email"
      type="email"
      value={FPasswordData.email}
      onChange={handleFPasswordInputChange}
    />
    
    <button className="flip-card__btn" type="submit">
      Let`s go!
    </button>
  </form>
  </div>
  </div>
  </div>
      </StyledWrapper> </div>
   );
};
const StyledWrapper = styled.div`
  .wrapper {
    --input-focus: #2d8cf0;
    --font-color: #323232;
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
  margin-top: 10px;
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

export default FPassword;