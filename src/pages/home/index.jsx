import React from "react";
import Deposits from "../deposits";
import Expenses from "../expenses";
import Grafica from "../graficas";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="graph-section">
        <Grafica />
      </div>

      <div className="data-sections">
        <Deposits showAddButton={false} />
      </div>
      <div className="data-sections">
        <Expenses showAddButton={false} />
      </div>
    </div>
  );
};

export default Home;
