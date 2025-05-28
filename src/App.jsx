import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { Button, SideNavigation, SideNavigationItem, Badge } from '@canonical/react-components';
import Bitacoras from './pages/Bitacoras';
import Fosas from './pages/Fosas';
import Indicios from './pages/Indicios';
import Introduccion from './pages/Introduccion';
import isMobile from './util/isMobile'; // Import the utility function
import "./css/App.css";
import "./css/style.css";


function App() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage menu visibility
  const [isMobileDevice, setIsMobileDevice] = useState(false);

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

  function CoordinadaSideNavigation() {
    const navigate = useNavigate();
    const location = useLocation();
  
    // Maneja clics para evitar recarga y usar navegación SPA
    const handleClick = (e, href) => {
      e.preventDefault();
      if (location.pathname !== href) {
        navigate(href);
      }
    };
  
    // Reescribimos items con onClick
    const processedItems = sideMenuItems.map(section => ({
      ...section,
      items: section.items.map(item => ({
        ...item,
        onClick: (e) => handleClick(e, item.href),
        href: item.href // evita navegación por defecto
      }))
    }));
  
    return (
      <SideNavigation items={processedItems} />
    );
  }

  return (
    <div className={`app-container row ${getPageClassName()} ${isMobileDevice ? 'mobile' : 'desktop'}`}>
      {/* Sidebar Section */}
      {isMobileDevice ? (
        <>
          <div className="mobile-header">
            <Link to="/" className="mobile-logo">
              <img
                src="/logotipoCuadrado.png"
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
              <SideNavigation>
                <SideNavigationItem>
                  <Button element={Link} to="/informacion" onClick={toggleMenu}>
                    Información
                  </Button>
                </SideNavigationItem>
                <SideNavigationItem>
                  <Button element={Link} to="/diarios" onClick={toggleMenu}>
                    Diarios de Campo
                  </Button>
                </SideNavigationItem>
                <SideNavigationItem>
                  <Button element={Link} to="/fosas" onClick={toggleMenu}>
                    Fosas
                  </Button>
                </SideNavigationItem>
                <SideNavigationItem>
                  <Button element={Link} to="/indicios" onClick={toggleMenu}>
                    Indicios
                  </Button>
                </SideNavigationItem>
              </SideNavigation>
              <footer className="p-card--highlighted u-no-padding">
                <p className="p-heading--5 u-padding">
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
        <aside className="col-2 p-side-navigation u-fixed-sidebar">
          <div className="sidebar-header">
            <Link to="/">
              <img
                src="/logotipoCuadrado.png"
                alt="Bitácoras Coordinadas Logo"
                className="sidebar-logo u-margin-top"
              />
            </Link>
          </div>

    
          <CoordinadaSideNavigation />

          <footer className="p-card--highlighted u-padding">
            <p className="p-heading--5 u-padding">
              <strong>Bitácoras Coordinadas</strong> es una iniciativa de{' '}
              <a href="https://tejer.red">tejer.red</a> que articula herramientas 
              digitales construidas junto a colectivos de búsqueda para registrar, 
              compartir y visibilizar hallazgos de forma autónoma, segura y 
              descentralizada.
            </p>
            <p style={{ textAlign: 'center' }}>
              <img
                src="https://tejer.red/logo.png"
                alt="Bitácoras Coordinadas Logo"
                className="sidebar-logo"
              />
            </p>
          </footer>
        </aside>
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