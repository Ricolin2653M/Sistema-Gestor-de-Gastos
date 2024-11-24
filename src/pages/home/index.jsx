import React from "react";
import Deposits from "../deposits";
import Expenses from "../expenses";
import Grafica from "../graficas";
import "./home.css";

const Home = () => {
  return (
    <div className="home-container">
      <div className="graficas">
        <Grafica/>
      </div>
      
      <div className="table-section">
        {/* Título para la tabla de Deposits */}
        <div className="table-wrapper">
       
          <div className="table-wrapper">
          <Deposits showAddButton={false} /> {/* Oculta el botón de agregar */}
        </div>
        
        </div>
        
        {/* Título para la tabla de Expenses */}
        <div className="table-wrapper">
         
        <Expenses showAddButton={false} />
        </div>
      </div>
    </div>
  );
};

export default Home;
