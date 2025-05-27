import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';
import '../css/indicios.css'; // Import the CSS file

function Indicios() {
  const [indicios, setIndicios] = useState([]);
  const [filters, setFilters] = useState({
    tipo_prenda: '',
    color: '',
    marca: '',
    talla: '',
    material: '',
    host: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'indicios');

      const details = await Promise.all(
        filtered.map(async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        })
      );

      setIndicios(details.filter(item => item !== null));
    };

    fetchData();
  }, []);

  const handleFilterChange = (taxonomy, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [taxonomy]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      tipo_prenda: '',
      color: '',
      marca: '',
      talla: '',
      material: '',
      host: '',
    });
  };

  const filteredIndicios = indicios.filter((indicio) => {
    // Check if the "host" filter is applied and matches
    const matchesHost = filters.host ? indicio.host === filters.host : true;

    // Check if all other filters match
    const matchesOtherFilters = Object.keys(filters).every((taxonomy) => {
      if (taxonomy === 'host' || !filters[taxonomy]) return true; // Skip "host" or empty filters
      return indicio.taxonomies.some(
        (tax) => tax.taxonomy === taxonomy && tax.slug === filters[taxonomy]
      );
    });

    // Combine all filter conditions
    return matchesHost && matchesOtherFilters;
  });

  const getUniqueTaxonomyValues = (taxonomy) => {
    const values = indicios
      .flatMap((indicio) =>
        indicio.taxonomies.filter((tax) => tax.taxonomy === taxonomy).map((tax) => tax)
      )
      .reduce((acc, tax) => {
        if (!acc.some((item) => item.slug === tax.slug)) {
          acc.push(tax);
        }
        return acc;
      }, []);
    return values;
  };

  const getUniqueHosts = () => {
    return [...new Set(indicios.map((indicio) => indicio.host))];
  };

  return (
    <div className="content-wide">
      <h1>Indicios</h1>
      <div id="filter-controls">
        <div>
          <label htmlFor="host-filter">COLECTIVO AUTOR:</label>
          <select
            id="host-filter"
            className="taxonomy-filter"
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
          <div key={taxonomy}>
            <label htmlFor={`${taxonomy}-filter`}>
              {taxonomy.replace('_', ' ').toUpperCase()}:
            </label>
            <select
              id={`${taxonomy}-filter`}
              className="taxonomy-filter"
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
        <button className="reset-filters-button" onClick={resetFilters}>
          Borrar Filtros
        </button>
      </div>

      <div id="indicio-gallery" className="grid">
        {filteredIndicios.map((indicio) => (
          <div
            key={`${indicio.host}-${indicio.type}-${indicio.id}`}
            className="indicio-item"
            {...Object.fromEntries(
              indicio.taxonomies.map((tax) => [`data-${tax.taxonomy}`, tax.slug])
            )}
          >
            <a href={`https://${indicio.host}/?p=${indicio.id}`}>
              <img
                src={indicio.media_url || indicio.image}
                alt={indicio.title}
                style={{ maxWidth: '300px', width: '100%' }}
              />
            </a>
            <h3>
              <a href={`https://${indicio.host}/?p=${indicio.id}`}>{indicio.title}</a>
            </h3>
            <p className="quiet">Colectivo autor: {indicio.host}</p>
            <p className="taxonomies">
              {indicio.taxonomies.map((tax) => (
                <span key={tax.slug}>
                  <strong>{tax.taxonomy.replace('_', ' ').toUpperCase()}:</strong>{' '}
                  <span className="taxonomy">{tax.name}</span>
                  <br />
                </span>
              ))}
            </p>
            <a
              href={`https://${indicio.host}/?p=${indicio.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="indicio-link"
            >
              Ver indicio en sitio original
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Indicios;
