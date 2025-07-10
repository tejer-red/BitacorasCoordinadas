import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';
import '../css/indicios.css'; // Import the CSS file
import IndicioGridItem from '../components/IndicioGridItem';
import IndiciosFilters from '../components/IndiciosFilters';
import { Row, Col } from '@canonical/react-components';

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

      // Filtrar por instancias visibles
      const visibles = JSON.parse(localStorage.getItem('VISIBLE_INSTANCIAS') || '[]');
      const indiciosFiltrados = visibles.length > 0
        ? details.filter(item => item !== null && visibles.includes(item.host))
        : details.filter(item => item !== null);

      setIndicios(indiciosFiltrados);
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
      <IndiciosFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        getUniqueTaxonomyValues={getUniqueTaxonomyValues}
        getUniqueHosts={getUniqueHosts}
      />
      <Row className="p-grid">
        {filteredIndicios.map((indicio) => (
          <Col size="2" key={`${indicio.host}-${indicio.type}-${indicio.id}`}>
            <IndicioGridItem indicio={indicio} />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Indicios;
