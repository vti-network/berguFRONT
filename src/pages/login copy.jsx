// Login.jsx
import '../component/css/Login.css';
//
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:8888/api/login', {
        email: username,
        pin: pin,
      });

      if (response && response.data.success) {
        setShowOtpInput(true);
        setPesan(response.data.message);
      } else {
        console.error('Format respons tidak sesuai:', response);
        setPesan('Format respons tidak sesuai. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error saat login:', error.response);
      setPesan('Otentikasi gagal. Email atau pin tidak valid.');
    }
  };

  const loginwithotp = async () => {
    try {
      const response = await axios.get(`http://localhost:8888/api/login/${username}/${pin}/${otp}`);
      if (response && response.data.success) {
        setPesan(response.data.message);
        setToken(response.data.token);
        setToken(response.data.alamat);
        setToken(response.data.secretKey);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('alamat', response.data.alamat);
        localStorage.setItem('secretKey', response.data.secretKey);
        navigate('/');
      } else {
        console.error('Format respons tidak sesuai:', response);
        setPesan('OTP salah');
      }
    } catch (error) {
      console.error('Error saat login:', error.response);
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
