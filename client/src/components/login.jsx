import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/signup.css";

export default function LogIn(){
    const [error, setError] = useState("");
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData.entries())

        try{
           const resposne = await fetch("http://localhost:5000/api/login", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data),
            credentials: 'include',
           })
           const results = await resposne.json()
           if(results.success){
            navigate(results.redirect)
           }
        }catch(err){
            console.log(err)
        }
    }

    //Have used the same stylesheet as signup
    return (
        <>
          <div className="body">
            <div className="signup-container">
              <h2>Login</h2>
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
                   Login
                </button>
              </form>
            </div>
          </div>
        </>
      );
}