// Register.jsx
import '../component/css/Login.css';
//
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Register() {
    //
    const navigate = useNavigate ();
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [pesan, setPesan] = useState('');

  
    //
    const NewReg = async () => {
      try {
        const response = await axios.post('http://localhost:8888/api/r', {
          email: username,
          pin: pin,
        });
  
        if (response && response.data.success) {
          setPesan(response.data.message);
          navigate('/login');
        } else {
          console.error('Format respons tidak sesuai:', response);
          setPesan('Format respons tidak sesuai. Silakan coba lagi.');
        }
      } catch (error) {
        console.error('Error:', error.response);
        setPesan('gagal. Email atau pin tidak valid.');
      }
    };
  
  return (
    <div className="content-login">
    <span className='alert'>{pesan}</span>
      <h2>Register</h2>
      <form>
        <div className="input-container">
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

        </div>
        <button type="button" onClick={NewReg}>
            Register
        </button>
        <div className="additional-links">
          <span><a href="/">Back</a></span>
          <span><a href="/login">Login here</a></span>
        </div>
      </form>

    </div>
  );
}


export default Register;
