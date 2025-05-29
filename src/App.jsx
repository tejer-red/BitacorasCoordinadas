import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@canonical/react-components';
import Bitacoras from './pages/Bitacoras';
import Fosas from './pages/Fosas';
import Indicios from './pages/Indicios';
import Introduccion from './pages/Introduccion';
import isMobile from './util/isMobile';
import MenuDesktop from './components/Menu/MenuDesktop';
import MenuMobile from './components/Menu/MenuMobile';
import "./css/App.css";
import "./css/style.css";

const sideMenuItems = [
  {
    className: 'menu-principal',
    items: [
      { href: '/informacion', label: 'Información' },
      { href: '/diarios', label: 'Diarios de Campo' },
      { href: '/fosas', label: 'Fosas' },
      { href: '/indicios', label: 'Indicios' }
    ]
  }
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const getPageClassName = () => {
    switch (location.pathname) {
      case '/informacion':
        return 'informacion';
      case '/diarios':
        return 'diarios';
      case '/fosas':
        return 'fosas';
      case '/indicios':
        return 'indicios';
      default:
        return '';
    }
  };

  const handleNavigation = (e, href) => {
    e.preventDefault();
    if (location.pathname !== href) {
      navigate(href);
    }
  };

  return (
    <div className={`app-container row ${getPageClassName()} ${isMobileDevice ? 'mobile' : 'desktop'}`}>
      {/* Sidebar Section */}
      {isMobileDevice ? (
        <MenuMobile sideMenuItems={sideMenuItems} onNavigate={handleNavigation} />
      ) : (
        <MenuDesktop sideMenuItems={sideMenuItems} onNavigate={handleNavigation} />
      )}

      {/* Main Content Section */}
      <main className="col-10 u-padding u-has-sidebar">
        <Routes>
          <Route path="/informacion" element={<Introduccion />} />
          <Route path="/diarios" element={<Bitacoras />} />
          <Route path="/fosas" element={<Fosas />} />
          <Route path="/indicios" element={<Indicios />} />
          <Route path="*" element={<Navigate to="/informacion" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </Router>
  );
}