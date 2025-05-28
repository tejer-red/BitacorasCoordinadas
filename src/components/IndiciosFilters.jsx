import React from 'react';

const IndiciosFilters = ({
  filters,
  handleFilterChange,
  resetFilters,
  getUniqueTaxonomyValues,
  getUniqueHosts,
}) => (
  <div id="filter-controls" className="p-form u-padding u-no-margin">
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

    {['tipo_prenda', 'color', 'marca', 'talla', 'material'].map((taxonomy) => (
      <div key={taxonomy} className="p-form__group">
        <label
          className="p-form__label"
          htmlFor={`${taxonomy}-filter`}
        >
          {taxonomy.replace('_', ' ').toUpperCase()}:
        </label>
        <select
          id={`${taxonomy}-filter`}
          className="p-form__control"
          value={filters[taxonomy]}
          onChange={(e) =>
            handleFilterChange(taxonomy, e.target.value)
          }
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
  </div>
);

export default IndiciosFilters;
