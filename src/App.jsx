import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import Bitacoras from './pages/Bitacoras';
import Fosas from './pages/Fosas';
import Indicios from './pages/Indicios';
import Introduccion from './pages/Introduccion';
import isMobile from './util/isMobile';
import "./css/style.css";
import { Button, Navigation } from '@canonical/react-components'; // Removed Logo and Footer

function App() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(isMobile());
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <Button appearance="base" onClick={toggleMenu}>
              ☰
            </Button>
          </div>
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-header">
                <Button appearance="negative" onClick={toggleMenu}>
                  ✖
                </Button>
              </div>
              <Navigation
                logo={{ url: "https://tejer.red/logo.png", title: "Bitácoras Coordinadas" }} // Provide a valid logo prop
                items={[
                  { label: 'Información', url: '/informacion', onClick: toggleMenu },
                  { label: 'Diarios de Campo', url: '/diarios', onClick: toggleMenu },
                  { label: 'Fosas', url: '/fosas', onClick: toggleMenu },
                  { label: 'Indicios', url: '/indicios', onClick: toggleMenu },
                ]}
              />
              <footer>
                <p>
                  <strong>Coordinadas</strong> es una iniciativa de{' '}
                  <a href="https://tejer.red">tejer.red</a> que articula herramientas 
                  digitales construidas junto a colectivos de búsqueda para registrar, 
                  compartir y visibilizar hallazgos de forma autónoma, segura y 
                  descentralizada.
                </p>
              </footer>
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
          <Navigation
            logo={{ url: "https://tejer.red/logo.png", title: "Bitácoras Coordinadas" }} // Provide a valid logo prop
            items={[
              { label: 'Información', url: '/informacion' },
              { label: 'Diarios de Campo', url: '/diarios' },
              { label: 'Fosas', url: '/fosas' },
              { label: 'Indicios', url: '/indicios' },
            ]}
          />
          <footer>
            <p>
              <strong>Coordinadas</strong> es una iniciativa de{' '}
              <a href="https://tejer.red">tejer.red</a> que articula herramientas 
              digitales construidas junto a colectivos de búsqueda para registrar, 
              compartir y visibilizar hallazgos de forma autónoma, segura y 
              descentralizada.
            </p>
          </footer>
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