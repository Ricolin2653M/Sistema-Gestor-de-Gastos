import { Card, Col, Row } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './componets/Nav/NavBar'; 
import AppRoutes from './routes';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <NavBar /> {/* Renderiza NavBar en todas las páginas */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
