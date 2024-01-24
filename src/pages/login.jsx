// Login.jsx
import '../component/css/Login.css';
//
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

function Login({ setToken }) {
  //
  const navigate = useNavigate ();
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [pesan, setPesan] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');

  //
  const getotp = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          pin: pin,
        }),
      });

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setShowOtpInput(true);
        setPesan(responseData.message);
      } else {
        console.error('Format respons tidak sesuai:', responseData);
        setPesan('Format respons tidak sesuai. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error saat login:', error);
      setPesan('Otentikasi gagal. Email atau pin tidak valid.');
    }
  };

  const loginwithotp = async () => {
    try {
      const response = await fetch(`http://localhost:8888/api/login/${username}/${pin}/${otp}`);

      const responseData = await response.json();

      if (response.ok && responseData.success) {
        setPesan(responseData.message);
        setToken(responseData.token);
        setToken(responseData.alamat);
        setToken(responseData.secretKey);
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('alamat', responseData.alamat);
        localStorage.setItem('secretKey', responseData.secretKey);
        navigate('/');
      } else {
        console.error('Format respons tidak sesuai:', responseData);
        setPesan('OTP salah');
      }
    } catch (error) {
      console.error('Error saat login:', error);
      setPesan('OTP salah.');
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };
  //
  return (
    <div className="content-login">
    <span className='alert'>{pesan}</span>
      <h2>Login</h2>
      <form>
        <div className="input-container">

        
        {showOtpInput ? null : (
            <>
              <label>
                email:
                <input
                  type="email"
                  required
                  placeholder="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>

              <label>
                pin:
                <input
                  type="text"
                  required
                  placeholder="pin"
                  maxLength="6"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                />
              </label>
              <br />
              <button type="button" onClick={getotp}>
                Login
              </button>
            </>
          )}


          {showOtpInput && (
            <div>
                <input className='otpcode'
                  type="text"
                  value={otp}
                  onChange={handleOtpChange} required placeholder='OTP CODE' style={{ textAlign: 'center' }}
                />
                <br />
                <button type="button" onClick={loginwithotp}>
                Authorization
                </button> 
            </div>
          )}

        </div>
        {/* <button type="submit" onclick={otp}>Login</button> */}
        <div className="additional-links">
          <span><a href="/">Back</a></span>
          <span><a href="/register">Register here</a></span>
        </div>
      </form>

    </div>
  );
}


export default Login;
