"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import Image from "next/image";
import logo from "./logo1.png";
import "./Navbar.css"
import AuthPopup from '@/app/adminauth/AuthPopup';

const Navbar = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = React.useState(false)

  const [isloggedin, setIsloggedin] = React.useState<boolean>(false)

  const [showpopup, setShowpopup] = React.useState<boolean>(false)

  const checkAdminAuthenticated = async () => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + "/admin/checklogin", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (response.ok) {
        setIsAdminAuthenticated(true)
      }
      else {
        setIsAdminAuthenticated(false)
      }

    } catch (error) {
      console.error(error)
      setIsAdminAuthenticated(false)
    }
  }
  useEffect(() => {
    checkAdminAuthenticated();
  }, [])


  return (
    <div className='navbar' >
      <Image src={logo} alt='logo' width={100} height={50} className='logo' />
      <div className="adminlinks">
        {
          isAdminAuthenticated ? (
            <>
              <Link className='link-btn' href = '/pages/userData'>User Data</Link>
              <Link className='link-btn' href = '/pages/Trainer'>Trainer</Link>
              <button className='btn1'  onClick={() => {
                    setShowpopup(true)
                  }}>Logout</button>
            </>
          ) : (
            <>
              {
                isloggedin ?
                  <Link className='link-btn' href = '/pages/userData'>User Data</Link>
                  :
                  <button className='btn1' onClick={() => {
                    setShowpopup(true)
                  }}>Log In</button>
              }
            </>
          )}

        {
          showpopup && <AuthPopup setShowpopup={setShowpopup} />
        }
      </div>
    </div >
  )
}

export default Navbar