import React from 'react';
import { Button, Input, CustomSelect } from '@canonical/react-components';
import FosasListItem from './FosasListItem';

function FosasSidebar({
  fosas,
  searchTerm,
  setSearchTerm,
  selectedColectivo,
  setSelectedColectivo,
  isExpanded,
  toggleSidebarHeight,
  handleTitleClick,
  isMobileDevice,
}) {
  const uniqueColectivos = [...new Set(fosas.map(fosa => fosa.host))];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleColectivoChange = (value) => {
    setSelectedColectivo(value);
  };

  const filteredFosas = fosas.filter((fosa) => {
    const matchesSearchTerm =
      fosa.title.toLowerCase().includes(searchTerm) ||
      fosa.host.toLowerCase().includes(searchTerm) ||
      fosa.slug.toLowerCase().includes(searchTerm) ||
      fosa.taxonomies?.some(tax => tax.name.toLowerCase().includes(searchTerm)) ||
      fosa.meta?.descripcion?.toLowerCase().includes(searchTerm);

    const matchesColectivo = selectedColectivo
      ? fosa.host === selectedColectivo
      : true;

    return matchesSearchTerm && matchesColectivo;
  });

  return (
    <div
      className={`p-card sidebar-container ${isMobileDevice ? 'mobile' : ''} ${
        isExpanded ? 'full-page' : ''
      }`}
    >
      {isMobileDevice && (
        <Button
          appearance="base"
          className="toggle-sidebar-button"
          onClick={toggleSidebarHeight}
        >
          {isExpanded ? 'Reducir' : 'Expandir'}
        </Button>
      )}
      <div className="p-card__inner">
        <Input
          type="text"
          placeholder="Buscar por zonas, descripción o colectivo"
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <CustomSelect
          label="Seleccionar Colectivo"
          name="colectivoSelect"
          options={[
            { disabled: false, label: 'Todos los colectivos', text: 'Todos los colectivos', value: '' },
            ...uniqueColectivos.map((colectivo) => ({
              disabled: false,
              label: colectivo,
              text: colectivo,
              value: colectivo,
            })),
          ]}
          value={selectedColectivo}
          onChange={handleColectivoChange}
          searchable="always" // Enable search functionality
          initialPosition="left"
        />
      </div>
      <ul className="p-list fosas-list">
        {filteredFosas.map((fosa) => (
          <FosasListItem
            key={`${fosa.host}-${fosa.type}-${fosa.id}`}
            fosa={fosa}
            handleTitleClick={handleTitleClick}
          />
        ))}
      </ul>
    </div>
  );
}

export default FosasSidebar;
