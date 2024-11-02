
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUpPageStyle.css";
import logo from "../src/assets/logo.png";

function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();

  const handleDoneClick = () => {
    // Save the user's name in localStorage or pass it via navigation state
    localStorage.setItem("userFirstName", firstName);
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="image-container">
        <img className="sign-up-logo" src={logo} alt="Logo"/>
      </div>
      <h1>Sign Up</h1>

      <form>
        <label>First Name:</label>
        <input
          className="signup-inputs"
          placeholder="Alex"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Last Name: </label>
        <input className="signup-inputs" placeholder="Jack"  required />

        <label>Email: </label>
        <input className="signup-inputs" placeholder="alexjack@email.com" />

        <label>Phone Number: </label>
        <input className="signup-inputs" placeholder="123-222-333" />

        <label>Username: </label>
        <input className="signup-inputs" placeholder="AlexJ" />

        <label>Password: </label>
        <input className="signup-inputs" placeholder="************" />
      </form>

      <button onClick={handleDoneClick}>Done</button>
    </div>
  );
}

export default SignUpPage;
