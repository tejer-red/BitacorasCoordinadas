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

  const filteredIndicios = indicios.filter((indicio) => {
    return Object.keys(filters).every((taxonomy) => {
      if (!filters[taxonomy]) return true; // If no filter is applied, include all
      return indicio.taxonomies.some(
        (tax) => tax.taxonomy === taxonomy && tax.slug === filters[taxonomy]
      );
    }) && (
      indicio.title.toLowerCase().includes(filters.tipo_prenda) || // Match by title (nombre)
      indicio.host.toLowerCase().includes(filters.tipo_prenda) || // Match by colectivo autor
      indicio.slug.toLowerCase().includes(filters.tipo_prenda) || // Match by slug
      indicio.taxonomies?.some(tax => tax.name.toLowerCase().includes(filters.tipo_prenda)) || // Match by zona
      indicio.meta?.descripcion?.[0]?.toLowerCase().includes(filters.tipo_prenda) // Match by descripción
    );
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

  return (
    <div className="content-wide">
      <div id="filter-controls">
        {['tipo_prenda', 'color', 'marca', 'talla', 'material'].map((taxonomy) => (
          <div key={taxonomy} style={{ marginRight: '10px', display: 'inline-block' }}>
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
      </div>

      <div id="indicio-gallery" className="grid">
        {filteredIndicios.map((indicio) => (
          <div
            key={indicio.id}
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
            <p className="quiet">Posted by {indicio.host}</p>
            <p className="taxonomies">
              {indicio.taxonomies.map((tax) => (
                <span key={tax.slug}>
                  <strong>{tax.taxonomy.replace('_', ' ').toUpperCase()}:</strong>{' '}
                  <span className="taxonomy">{tax.name}</span>
                  <br />
                </span>
              ))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Indicios;
