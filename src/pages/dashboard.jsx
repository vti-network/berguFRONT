//Dashboard.jsx

import React, { useState, useEffect } from 'react';
import MyHeader from "../component/header";
import DashboardTable from "../component/dashboardtable";
import '../component/css/table.css'

function Dashboard() {

  const [token, setToken] = useState(null);
  const [alamat, setAlamat] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const infoAddress = localStorage.getItem('alamat');
   
    if (storedToken) {
      setToken(storedToken);
    }
    if (infoAddress) {
      setAlamat(infoAddress);
    }
  }, []);

    return (
        <div>
        <MyHeader token={token} setToken={setToken} alamat={alamat}/>
        <div className="content">
            ini Dashboard
            <div className="tconntainer">
              <DashboardTable />  
            </div>
            
        </div>
        </div>

    );
  }

  export default Dashboard;