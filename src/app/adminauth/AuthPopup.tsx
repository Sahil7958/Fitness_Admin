"use client"
import React, { useState, useEffect } from 'react'
import "./auth.css";
import { ToastContainer, toast } from 'react-toastify';
import { AiFillDelete, AiOutlineClose } from "react-icons/ai";

interface AuthPopupProps {
  setShowpopup: React.Dispatch<React.setStateAction<boolean>>;
}
interface SignupFormData {
  name: String | null,
  email: String | null,
  password: String | null
}

const AuthPopup: React.FC<AuthPopupProps> = ({ setShowpopup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showsSignup, setShowSignup] = React.useState<boolean>(false)

  const handleSignup = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include'
      })

      const data = await response.json();

      if (data.ok) {

        console.log("Admin Registration Successful", data);
        toast.success("Admin Registration Successful", {
          position: "top-center"
        })
      }
      else {
        console.error("Admin Registration Failed", response.statusText);
        toast.error("Admin Registration Failed", {
          position: "top-center"
        })
      }
    } catch (error) {
      toast.error("An error occured during registration");
      console.error("An error occured during registration", error);
    }

  }
  const handleLogin = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      const data = await response.json();
      if (data.ok) {
        console.log("Admin Login Successful", data);
        toast.success("Admin Login Successful", {
          position: "top-center"
        })
        window.location.href = '/'
        // window.location.href = '/pages/userData'
      }
      else {
        console.error("Admin Login Failed", response.statusText);
        toast.error("Admin Login Failed", {
          position: "top-center"
        })
      }
    } catch (error) {
      toast.error("An error occured during login");
      console.error("An error occured during login", error);
    }
  }
  return (
    <div className='popup'>
      <div className="wrapper">
        <div className="closebtn">
          <button className="icon-close" onClick={() => { setShowpopup(false) }}><AiOutlineClose /></button>
        </div>
        {
          showsSignup ? (
            <div className="form-box register">
              <h2>Signup</h2>
              <form action="">
                <div className="input-box">
                  <input type='text' onChange={(e) => { setName(e.target.value) }} required />
                  <label>Name</label>
                </div>
                <div className="input-box">
                  <input onChange={(e) => { setEmail(e.target.value) }} required />
                  {/* type='email' */}
                  <label>Email</label>
                </div>
                <div className="input-box">
                  <input type='password' onChange={(e) => { setPassword(e.target.value) }} required />
                  <label>Password</label>
                </div>

                <button className='btn' onClick={(e) => {
                  handleSignup()
                  e.preventDefault()
                }}>Signup</button>
              </form>
              <div className="register-link">
                <p>Already have an account?<button onClick={() => {
                  setShowSignup(false)
                }}>Login</button></p>
              </div>
            </div>
          ) :
            (
              <div className="form-box login">
                <h2>Login</h2>
                <form action="">
                  <div className="input-box">
                    <input onChange={(e) => { setEmail(e.target.value) }} required />
                    {/* type='email' */}
                    <label>Email</label>
                  </div>
                  <div className="input-box">
                    <input type='password' onChange={(e) => { setPassword(e.target.value) }} required />
                    <label>Password</label>
                  </div>

                  <button className='btn' onClick={(e) => {
                    e.preventDefault()
                    handleLogin()
                  }}>Login</button>
                </form>
                <div className="register-link">
                  <p>Dont have an account?<button onClick={() => {
                    setShowSignup(true)
                  }}>Signup</button></p>
                </div>
              </div>
            )
        }
      </div>
    </div >
  )
}

export default AuthPopup