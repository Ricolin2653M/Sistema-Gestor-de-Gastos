import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import AppRoutes from './routes';
import NavBar from './componets/Nav/NavBar';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App