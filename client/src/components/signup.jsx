import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/signup.css";

export default function NewUser() {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  /*useEffect( () => {
        fetch('http://localhost:5000/api/test')
        .then( response => response.json() )
        .then( data => {
            setUser(data)
            console.log(data)
        })
        .catch(err => {
            console.log(err)
        })
    },[])*/

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (!data.username || !data.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const results = await response.json();
      if (results.success) {
        navigate("/login");
      }
    } catch (error) {
      return <p>Failed to send data: {error}</p>;
    }
  };
  return (
    <>
      {/*(typeof user.test === 'undefined') ? (
            <p>Loading...</p>
        ): user.test.map((item, i) => (
            <p key={i}>{item}</p>
        ))*/}
      <div className="body">
        <div className="signup-container">
          <h2>Sign Up</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-container">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
