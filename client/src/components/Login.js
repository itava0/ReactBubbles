import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils";

const Login = props => {
  console.log(props)
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
})

const handleChange = e => {
  setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
  })
}

// Upon submitting form, if credentials match, a token will be saved to 
//localStorage and user will be sent to BubblesPage page
const handleSubmit = e => {
  e.preventDefault();
  axiosWithAuth()
    .post("/api/login", credentials)
    .then(res => {
          localStorage.setItem('token', res.data.payload)
          props.history.push("/BubblePage")    
      })
      .catch(err => console.log(err.response))
}

  return (
    <>
      <h1>Welcome to the Bubble App!</h1>
      <form onSubmit={handleSubmit}>
            <input 
                type="text"
                name="username"
                placeholder="username"
                value={credentials.username}
                onChange={handleChange}
            />
            <input 
                type="text"
                name="password"
                placeholder="password"
                value={credentials.password}
                onChange={handleChange}
            />
            <button type="submit">Login</button>
        </form> 
    </>
  );
};

export default Login;
