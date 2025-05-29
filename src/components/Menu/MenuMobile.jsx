import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, SideNavigation } from '@canonical/react-components';

function MenuMobile({ sideMenuItems, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const processedItems = sideMenuItems.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      onClick: (e) => {
        toggleMenu();
        onNavigate(e, item.href);
      },
      href: item.href // Prevent default navigation
    }))
  }));

  return (
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
          <SideNavigation items={processedItems} />
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
  );
}

export default MenuMobile;
