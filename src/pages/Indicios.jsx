import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails, concurrentMap } from '../api/dataService';
import '../css/indicios.css'; // Import the CSS file
import IndicioGridItem from '../components/IndicioGridItem';
import IndiciosFilters from '../components/IndiciosFilters';
import { Row, Col } from '@canonical/react-components';
import { useLocation } from 'react-router-dom';
import Loading from '../components/Loading';

function Indicios() {
  const [indicios, setIndicios] = useState([]);
  const [loading, setLoading] = useState(true); // Añadido loading
  const [filters, setFilters] = useState({
    tipo_prenda: '',
    color: '',
    marca: '',
    talla: '',
    material: '',
    host: '',
    fosa_relacionada: '', // Nuevo filtro
  });

  const location = useLocation();

  // Leer parámetros de la URL y aplicarlos como filtros iniciales solo una vez
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fosa_relacionada = params.get('fosa_relacionada') || '';
    const host = params.get('host') || '';
    if (fosa_relacionada || host) {
      setFilters((prev) => ({
        ...prev,
        fosa_relacionada,
        host,
      }));
    }
    // Solo en el primer render con location.search
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Inicia loading
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'indicios');

      // Usa concurrentMap importado
      const details = await concurrentMap(
        filtered,
        async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        },
        5
      );

      // Filtrar por instancias visibles
      const visibles = JSON.parse(localStorage.getItem('VISIBLE_INSTANCIAS') || '[]');
      const indiciosFiltrados = visibles.length > 0
        ? details.filter(item => item !== null && visibles.includes(item.host))
        : details.filter(item => item !== null);

      setIndicios(indiciosFiltrados);
      setLoading(false); // Finaliza loading
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
      fosa_relacionada: '', // Nuevo filtro
    });
  };

  const filteredIndicios = indicios.filter((indicio) => {
    // Filtro por fosa_relacionada
    const matchesFosa = filters.fosa_relacionada
      ? (indicio.meta?.fosa_relacionada || []).includes(filters.fosa_relacionada)
      : true;

    // Check if the "host" filter is applied and matches
    const matchesHost = filters.host ? indicio.host === filters.host : true;

    // Check if all other filters match
    const matchesOtherFilters = Object.keys(filters).every((taxonomy) => {
      if (taxonomy === 'host' || taxonomy === 'fosa_relacionada' || !filters[taxonomy]) return true;
      return indicio.taxonomies.some(
        (tax) => tax.taxonomy === taxonomy && tax.slug === filters[taxonomy]
      );
    });

    // Combine all filter conditions
    return matchesFosa && matchesHost && matchesOtherFilters;
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

  // Obtener todas las fosas relacionadas con los indicios (únicas), filtrando por colectivo si aplica
  const getUniqueFosas = () => {
    const fosaMap = {};
    indicios.forEach(indicio => {
      // Si hay filtro de colectivo, solo considerar indicios de ese colectivo
      if (filters.host && indicio.host !== filters.host) return;
      const rels = indicio.meta?.fosa_relacionada || [];
      rels.forEach(fosaId => {
        let title = null;
        if (indicio.fosa_title && typeof indicio.fosa_title === 'object' && indicio.fosa_title[fosaId]) {
          title = indicio.fosa_title[fosaId];
        }
        if (!title && indicio.fosas && Array.isArray(indicio.fosas)) {
          const fosaObj = indicio.fosas.find(f => String(f.id) === String(fosaId));
          if (fosaObj) title = fosaObj.title;
        }
        if (!title && indicio.meta?.fosa_titulo && Array.isArray(indicio.meta.fosa_titulo)) {
          const idx = (indicio.meta?.fosa_relacionada || []).findIndex(id => String(id) === String(fosaId));
          if (idx !== -1 && indicio.meta.fosa_titulo[idx]) {
            title = indicio.meta.fosa_titulo[idx];
          }
        }
        if (!title) {
          title = `Fosa ${fosaId}`;
        }
        fosaMap[fosaId] = title;
      });
    });
    return Object.entries(fosaMap).map(([id, title]) => ({ id, title }));
  };

  if (loading) {
    return <Loading text="Cargando indicios..." />;
  }

  return (
    <div className="content-wide">
      <h1>Indicios</h1>
      <IndiciosFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        getUniqueTaxonomyValues={getUniqueTaxonomyValues}
        getUniqueHosts={getUniqueHosts}
        getUniqueFosas={getUniqueFosas} // Nuevo prop
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
