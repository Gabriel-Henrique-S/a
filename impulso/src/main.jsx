import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ImpulsoProvider } from './state';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Favorites from './pages/Favorites';
import Content from './pages/Content';
import NotFound from './pages/NotFound';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><MotionConfig reducedMotion="user"><HashRouter><ImpulsoProvider><Routes><Route element={<Layout/>}><Route index element={<Home/>}/><Route path="explorar" element={<Explore/>}/><Route path="favoritos" element={<Favorites/>}/><Route path="conteudo/:id" element={<Content/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></ImpulsoProvider></HashRouter></MotionConfig></React.StrictMode>
);
