import React from 'react';
import { Link } from 'react-router-dom';
import { SideNavigation } from '@canonical/react-components';

function MenuDesktop({ sideMenuItems, onNavigate }) {
  const processedItems = sideMenuItems.map(section => ({
    ...section,
    items: section.items.map(item => ({
      ...item,
      onClick: (e) => onNavigate(e, item.href),
      href: item.href // Prevent default navigation
    }))
  }));

  return (
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
      <SideNavigation items={processedItems} />
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
  );
}

export default MenuDesktop;
