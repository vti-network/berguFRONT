//Public.jsx
import React from "react";
import { useParams } from 'react-router-dom';
import MyHeader from "../component/header";
import DashboardTable from "../component/dashboardpublictable";
import '../component/css/table.css'

function Public() {
    const { hashaddress } = useParams();
    return (
        <div>
        <MyHeader />
        <div className="content">
            <div className="tconntainer">
              <DashboardTable hashaddress={hashaddress}/>  
            </div>
            
        </div>
        </div>

    );
  }

  export default Public;