import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import MainDashboard from './components/MainDashboard';

function App() {
  return (
  <Router>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      {/* <Route path='/' element={<Dashboard/>}/> */}
      <Route path='/' element={<MainDashboard/>}/>
    </Routes> 
  </Router>
  );
}

export default App;
