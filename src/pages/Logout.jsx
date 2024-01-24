//logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout({ setToken }) {
  const navigate = useNavigate ();

  useEffect(() => {
    // Hapus semua token dari penyimpanan lokal
    localStorage.clear();

    // Set token ke null
    setToken(null);

    // Arahkan pengguna ke halaman login
    navigate('/login');
  }, [setToken, navigate]);

  return (
    <div>
      <p>Logging out...</p>
      {/* Anda dapat menambahkan elemen atau pesan lain jika diperlukan */}
    </div>
  );
}

export default Logout;