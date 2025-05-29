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
        <SideNavigation
          className="p-header__navigation_mobile"
          items={processedItems}
          aria-label="Mobile navigation"
        />
      )}
    </header>
  );
}

export default MenuMobile;
