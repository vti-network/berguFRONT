// Header.jsx
import React, { useState, useEffect } from 'react';

function Mynav({token}) {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Home</a>
          <a href="/about">about</a>
          {token ? (
          <a href="/user">user</a>
                    ) : (
          <a href="/login"> </a>
          )}
          {token ? (
          <a href="/logout">Logout</a>
                    ) : (
          <a href="/login">Login</a>
          )}
        </li>
      </ul>
    </nav>
  );
}


function MyHeader() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }

  }, []);
  return (
    <header>
      <div className="header-container">
        <div className="logoHOME">
          <img src="bitcoin-logo.png" alt="Bitcoin Logo" className="btc-logo" />
        </div>
        <Mynav token={token} setToken={setToken}/>
      </div>
    </header>
  );
}

export default MyHeader;
