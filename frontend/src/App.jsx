import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Play from './pages/Play';
import Game from './pages/Game';
import EditGame from './pages/EditGame';
import Results from './pages/Results';
import EditQuestion from './pages/EditQuestion';
import Snake from './components/Snake';

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/play' element={<Play />} />
          <Route path='/play/:code' element={<Play />} />
          <Route path='/session/:sessionId' element={<Game />} />
          <Route path='/edit/:gameId' element={<EditGame />} />
          <Route path='/edit/:gameId/:questionId' element={<EditQuestion />} />
          <Route path='/results/:sessionId' element={<Results />} />
          <Route path='/snake' element={<Snake />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
