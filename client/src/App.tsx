import './App.css';
import { MainScreen } from './components/screen/main';
import { Test } from './components/screen/test'
import { Routes, Route, BrowserRouter } from 'react-router-dom';
function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <MainScreen/> }/>
        <Route path='/test' element={ <Test/> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;