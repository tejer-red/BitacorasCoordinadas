import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Bitacoras from './pages/Bitacoras';
import Fosas from './pages/Fosas';
import Indicios from './pages/Indicios';
import Introduccion from './pages/Introduccion';
import isMobile from './util/isMobile'; // Import the utility function
import "./css/App.css";

function App() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Determine the className based on the current route
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

  return (
    <div className={`app-container ${getPageClassName()} ${isMobileDevice ? 'mobile' : 'desktop'}`}>
      {/* Sidebar Section */}
      {isMobileDevice ? (
        <>
          <div className="mobile-header">
            <Link to="/" className="mobile-logo">
              <img
                src="https://tejer.red/logo.png"
                alt="Bitácoras Coordinadas Logo"
                className="mobile-logo-image"
              />
            </Link>
            <button className="hamburger-button" onClick={toggleMenu}>
              ☰
            </button>
          </div>
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <button className="close-button" onClick={toggleMenu}>
                  ✖
                </button>
              </div>
              <div className="mobile-menu-buttons">
                <Link to="/informacion" className="sidebar-button" onClick={toggleMenu}>
                  Información
                </Link>
                <Link to="/diarios" className="sidebar-button" onClick={toggleMenu}>
                  Diarios de Campo
                </Link>
                <Link to="/fosas" className="sidebar-button" onClick={toggleMenu}>
                  Fosas
                </Link>
                <Link to="/indicios" className="sidebar-button" onClick={toggleMenu}>
                  Indicios
                </Link>
              </div>
              <p className="sidebar-footer">
                <strong>Coordinadas</strong> es una iniciativa de{' '}
                <a href="https://tejer.red">tejer.red</a> que articula herramientas 
                digitales construidas junto a colectivos de búsqueda para registrar, 
                compartir y visibilizar hallazgos de forma autónoma, segura y 
                descentralizada.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="sidebar">
          <div className="sidebar-header">
            <Link to="/">
              <img
                src="https://tejer.red/logo.png"
                alt="Bitácoras Coordinadas Logo"
                className="sidebar-logo"
              />
            </Link>
          </div>
          <div className="sidebar-buttons">
            <Link to="/informacion" className="sidebar-button">
              Información
            </Link>
            <Link to="/diarios" className="sidebar-button">
              Diarios de Campo
            </Link>
            <Link to="/fosas" className="sidebar-button">
              Fosas
            </Link>
            <Link to="/indicios" className="sidebar-button">
              Indicios
            </Link>
          </div>
          <p className="sidebar-footer">
            <strong>Coordinadas</strong> es una iniciativa de{' '}
            <a href="https://tejer.red">tejer.red</a> que articula herramientas 
            digitales construidas junto a colectivos de búsqueda para registrar, 
            compartir y visibilizar hallazgos de forma autónoma, segura y 
            descentralizada.
          </p>
        </div>
      )}

      {/* Main Content Section */}
      <div className="content">
        <Routes>
          <Route path="/informacion" element={<Introduccion />} />
          <Route path="/diarios" element={<Bitacoras />} />
          <Route path="/fosas" element={<Fosas />} />
          <Route path="/indicios" element={<Indicios />} />
          <Route path="*" element={<Navigate to="/informacion" />} />
        </Routes>
      </div>
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