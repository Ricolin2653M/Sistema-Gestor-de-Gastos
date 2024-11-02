import React from "react";
import Deposits from "../deposits";
import Expenses from "../expenses";
import "./home.css"; 

const Home = () => {
  return (
    <div className="home-container">
      
      <div className="table-section" style={{ marginTop: '30px' }}>
     
        <div className="table-wrapper">
          <Deposits />
        </div>
      

        <div className="table-wrapper">
          <Expenses />
        </div>
      </div>
    </div>
  );
};

export default Home;
