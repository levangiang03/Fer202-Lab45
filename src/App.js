import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Components/home';
import Detail from './Components/detail';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Add from './Components/add';
import Update from './Components/update';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/product' element={<Home/>} />
        <Route path='/product/:pId' element={<Detail/>} />
        <Route path='/product/addProduct' element={<Add/>} />
        <Route path='/product/updateProduct/:pId' element={<Update/>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
