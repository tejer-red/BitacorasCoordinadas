import React, { useEffect } from 'react';
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
  // Obtener instancias visibles desde localStorage en cada render
  const visibles = JSON.parse(localStorage.getItem('VISIBLE_INSTANCIAS') || '[]');

  // Primero filtrar los colectivos (instancias visibles)
  const uniqueColectivosVisibles = [
    ...new Set(
      fosas
        .map(fosa => fosa.host)
        .filter(host => visibles.length === 0 || visibles.includes(host))
    ),
  ];

  // Si el colectivo seleccionado ya no está visible, limpiar el filtro
  useEffect(() => {
    if (selectedColectivo && !uniqueColectivosVisibles.includes(selectedColectivo)) {
      setSelectedColectivo('');
    }
    // eslint-disable-next-line
  }, [visibles.join(','), selectedColectivo, setSelectedColectivo]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleColectivoChange = (value) => {
    setSelectedColectivo(value);
  };

  // Luego filtrar la lista de fosas por colectivo visible y seleccionado
  const fosasFiltradasPorColectivo = fosas.filter(
    fosa => uniqueColectivosVisibles.includes(fosa.host)
  );

  const filteredFosas = fosasFiltradasPorColectivo.filter((fosa) => {
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
          className={`toggle-sidebar-button ${isExpanded ? 'p-button--negative has-icon' : 'p-button--positive has-icon'}`}
          onClick={toggleSidebarHeight}
        >
          {isExpanded ? (
            <>
              <i className="p-icon--chevron-down is-light"></i>
              <span>Reducir</span>
            </>
          ) : (
            <>
              <i className="p-icon--chevron-up is-light"></i>
              <span>Expandir</span>
            </>
          )}
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
            ...uniqueColectivosVisibles.map((colectivo) => ({
              disabled: false,
              label: colectivo,
              text: colectivo,
              value: colectivo,
            })),
          ]}
          value={selectedColectivo}
          onChange={handleColectivoChange}
          searchable="always"
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
