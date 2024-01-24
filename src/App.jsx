//app.jsx
import './component/css/App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//
// import MyHeader from './component/header'
//
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import Duser from './pages/user';
import PublicDasboard from './pages/dashboardpublic';
import Logout from './pages/Logout';


function App() {
  //
  const [token, setToken] = useState(null);
  const [alamat, setAlamat] = useState(null);
  const [secretKey, setSecretKey] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const infoAddress = localStorage.getItem('alamat');
    const infoKey = localStorage.getItem('secretKey');
    if (storedToken) {
      setToken(storedToken);
    }
    if (infoAddress) {
      setAlamat(infoAddress);
    }
    if (infoKey) {
      setSecretKey(infoKey);
    }
  }, []);
  //
  return (
    <div className='container'>
      
      <Router>
          <div class="content">
            <main>
                <Routes>
                  <Route path="/" element={<Dashboard />} token={token} setToken={setToken} alamat={alamat} secretKey={secretKey} setAlamat={setAlamat} setSecretKey={setSecretKey}/>
                  <Route path="/login" element={<Login setToken={setToken} />} />
                  <Route path="/register" element={<Register setToken={setToken} />} />
                  {/* <Route path="/user" element={<Duser setToken={setToken} />} /> */}
                  {token ? (
                  <Route path="/user" element={<Duser setToken={setToken} />} />
                            ) : (
                  <Route path="/block" element={<Block />} />
                  )}
                  <Route path="/logout" element={<Logout setToken={setToken} />} />
                  <Route path="/:hashaddress" element={<PublicDasboard />} />
                </Routes>
            </main>
          </div>
        </Router>

    </div>
  );
}

function Block (){
  return (
    <div>policy : login dulu boss</div>
  )
}

export default App;
