import React, { useState } from 'react';
import isMobile from '../util/isMobile';

const BitacorasFilters = ({
  filters,
  handleFilterChange,
  resetFilters,
  getUniqueHosts,
  getUniqueZonas,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobileDevice = isMobile();

  const toggleFilters = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div
      id="bitacoras-filter-controls"
      className={`p-form u-padding u-no-margin ${isExpanded ? 'expanded' : 'collapsed'}`}
      style={{ maxWidth: 'var(--col-8, 800px)', margin: '0 auto' }}
    >
      {isMobileDevice && (
        <button
          className={`toggle-filters-button ${isExpanded ? 'p-button--negative has-icon' : 'p-button--positive has-icon'}`}
          type="button"
          onClick={toggleFilters}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            width: '100%',
            borderBottom: '1px solid #ccc',
          }}
        >
          {isExpanded ? (
            <>
              <i className="p-icon--chevron-down is-light"></i>
              <span>Ocultar Filtros</span>
            </>
          ) : (
            <>
              <i className="p-icon--chevron-up is-light"></i>
              <span>Mostrar Filtros</span>
            </>
          )}
        </button>
      )}
      {(isExpanded || !isMobileDevice) && (
        <>
          {/* Colectivo */}
          <div className="p-form__group">
            <label className="p-form__label" htmlFor="host-filter">
              COLECTIVO AUTOR:
            </label>
            <select
              id="host-filter"
              className="p-form__control"
              value={filters.host || ''}
              onChange={(e) => handleFilterChange('host', e.target.value)}
            >
              <option value="">Todos</option>
              {getUniqueHosts().map((host) => (
                <option key={host} value={host}>
                  {host}
                </option>
              ))}
            </select>
          </div>
          {/* Zona */}
          <div className="p-form__group">
            <label className="p-form__label" htmlFor="zona-filter">
              ZONA:
            </label>
            <select
              id="zona-filter"
              className="p-form__control"
              value={filters.zona || ''}
              onChange={(e) => handleFilterChange('zona', e.target.value)}
            >
              <option value="">Todas</option>
              {getUniqueZonas().map((zona) => (
                <option key={zona} value={zona}>
                  {zona}
                </option>
              ))}
            </select>
          </div>
          <div className="u-align--right u-margin-top">
            <button
              className="p-button--negative"
              type="button"
              onClick={resetFilters}
            >
              Borrar Filtros
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BitacorasFilters;
