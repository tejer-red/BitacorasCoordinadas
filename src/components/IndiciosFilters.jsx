import React, { useState } from 'react';
import isMobile from '../util/isMobile';

const IndiciosFilters = ({
  filters,
  handleFilterChange,
  resetFilters,
  getUniqueTaxonomyValues,
  getUniqueHosts,
  getUniqueFosas, // Nuevo prop
}) => {
  const [isExpanded, setIsExpanded] = useState(true); // Default to expanded on desktop
  const isMobileDevice = isMobile();

  const toggleFilters = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div id="filter-controls" className={`p-form u-padding u-no-margin ${isExpanded ? 'expanded' : 'collapsed'}`}>
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
          {/* Filtro por fosa */}
          <div className="p-form__group">
            <label className="p-form__label" htmlFor="fosa-filter">
              FOSA RELACIONADA:
            </label>
            <select
              id="fosa-filter"
              className="p-form__control"
              value={filters.fosa_relacionada || ''}
              onChange={(e) => handleFilterChange('fosa_relacionada', e.target.value)}
            >
              <option value="">Todas</option>
              {getUniqueFosas().map((fosa) => (
                <option key={fosa.id} value={fosa.id}>
                  {fosa.title}
                </option>
              ))}
            </select>
          </div>
          {['tipo_prenda', 'color', 'marca', 'talla', 'material'].map((taxonomy) => (
            <div key={taxonomy} className="p-form__group">
              <label className="p-form__label" htmlFor={`${taxonomy}-filter`}>
                {taxonomy.replace('_', ' ').toUpperCase()}:
              </label>
              <select
                id={`${taxonomy}-filter`}
                className="p-form__control"
                value={filters[taxonomy]}
                onChange={(e) => handleFilterChange(taxonomy, e.target.value)}
              >
                <option value="">Todos</option>
                {getUniqueTaxonomyValues(taxonomy).map((tax) => (
                  <option key={tax.slug} value={tax.slug}>
                    {tax.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
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

export default IndiciosFilters;
