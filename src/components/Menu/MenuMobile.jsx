import React, { useState } from 'react';
import { PrimaryNav, Button, SideNavigation } from '@canonical/react-components';

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
      href: item.href
    }))
  }));

  return (
    <header className="p-header ">
      <div className="p-header__logo ">
        <a href="/">
          <img
            src="/logotipoHorizontal.png"
            alt="Bitácoras Coordinadas Logo"
            className="p-header__logo-image "
          />
        </a>
      </div>
      <div className="p-header__navigation ">
        <Button
          appearance="base"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
          className="u-hide--medium "
        >
          ☰
        </Button>
      </div>
      {isMenuOpen && (
        <div style={{
          background: "#d8d8d83b",
          width: "100dvw"
      }}>
        <SideNavigation
          className="p-header__navigation_mobile"
          items={processedItems}
          aria-label="Mobile navigation"
        />
        <footer className="u-padding">
        <p className=" p-card--highlighted p-heading--5 u-padding">
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
      </div>
        
      )}
    </header>
  );
}

export default MenuMobile;
