import styled from "styled-components";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const RPassword = () => {
  const navigate = useNavigate();
  const [RPmessage, setRPasswordmessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const [RPasswordData, setRPasswordData] = useState({
    userpassword: "",
    confirmuserpassword: "",
  });
  const { ResetToken } = useParams();

  const handleRPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setRPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRPassword = async (e) => {
    e.preventDefault();
    setRPasswordmessage("");
    const RP = {
      newuserpassword: RPasswordData.userpassword,
      confirmuserpassword: RPasswordData.confirmuserpassword,
    };
    try {
      const url = `https://sbroker-backend.vercel.app/api/v1/user/userpasswordreset/${ResetToken}`;
      const res = await axios.post(url, RP, { withCredentials: true });
      console.log(res);
      setRPasswordmessage(res.data.message);
      setIsSuccess(true); // Set success state to true
    } catch (error) {
      setRPasswordmessage(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
      setIsSuccess(false);
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="mt-40 ml-48">
      <StyledWrapper>
        <div className="wrapper">
          <div className="card-switch">
            <div className="flip-card__front">
              <div className="title">Reset Password</div>
              {RPmessage && <p className="error-message">{RPmessage}</p>}
              <form className="flip-card__form" onSubmit={handleRPassword}>
                <input
                  className="flip-card__input"
                  name="userpassword"
                  placeholder="New Password"
                  type="password"
                  value={RPasswordData.userpassword}
                  onChange={handleRPasswordInputChange}
                />
                <input
                  className="flip-card__input"
                  name="confirmuserpassword"
                  placeholder="Confirm Password"
                  type="password"
                  value={RPasswordData.confirmuserpassword}
                  onChange={handleRPasswordInputChange}
                />
                {isSuccess ? (
                  <button
                    className="flip-card__btn"
                    type="button"
                    onClick={handleNavigateToLogin}
                  >
                    Head to Login
                  </button>
                ) : (
                  <button className="flip-card__btn" type="submit">
                    Let's go!
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </StyledWrapper>
    </div>
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
  }
`;

export default RPassword;
