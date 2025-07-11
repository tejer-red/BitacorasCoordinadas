import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails, concurrentMap } from '../api/dataService';
import { Row, Button } from '@canonical/react-components';
import BitacoraGridItem from '../components/BitacoraGridItem';
import Loading from '../components/Loading';
import BitacorasFilters from '../components/BitacorasFilters';
import BitacorasMap from '../components/BitacorasMap';

function Bitacoras() {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    host: '',
    fosa_relacionada: '',
    fecha: '',
    zona: '',
  });
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'bitacoras');

      const details = await concurrentMap(
        filtered,
        async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          if (detail) {
            console.log('Bitácora Object:', detail);
          }
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        },
        5
      );

      // Filtrar por instancias visibles
      const visibles = JSON.parse(localStorage.getItem('VISIBLE_INSTANCIAS') || '[]');
      const bitacorasFiltradas = visibles.length > 0
        ? details.filter(item => item !== null && visibles.includes(item.host))
        : details.filter(item => item !== null);

      setBitacoras(bitacorasFiltradas);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      host: '',
      fosa_relacionada: '',
      fecha: '',
      zona: '',
    });
  };

  // Helpers para valores únicos
  const getUniqueHosts = () => [...new Set(bitacoras.map(b => b.host))];
  const getUniqueFosas = () => {
    const fosaMap = {};
    bitacoras.forEach(b => {
      const rels = b.meta?.fosa_relacionada || [];
      rels.forEach(fosaId => {
        let title = null;
        if (b.fosa_title && typeof b.fosa_title === 'object' && b.fosa_title[fosaId]) {
          title = b.fosa_title[fosaId];
        }
        if (!title && b.fosas && Array.isArray(b.fosas)) {
          const fosaObj = b.fosas.find(f => String(f.id) === String(fosaId));
          if (fosaObj) title = fosaObj.title;
        }
        if (!title && b.meta?.fosa_titulo && Array.isArray(b.meta.fosa_titulo)) {
          const idx = (b.meta?.fosa_relacionada || []).findIndex(id => String(id) === String(fosaId));
          if (idx !== -1 && b.meta.fosa_titulo[idx]) {
            title = b.meta.fosa_titulo[idx];
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
  const getUniqueZonas = () => {
    const zonas = [];
    bitacoras.forEach(b => {
      if (b.taxonomies && Array.isArray(b.taxonomies)) {
        b.taxonomies.forEach(tax => {
          if (tax.taxonomy === 'zona' && tax.name && !zonas.includes(tax.name)) {
            zonas.push(tax.name);
          }
        });
      }
    });
    return zonas;
  };

  // Aplicar filtros
  const filteredBitacoras = bitacoras.filter((b) => {
    const matchesHost = filters.host ? b.host === filters.host : true;
    const matchesFosa = filters.fosa_relacionada
      ? (b.meta?.fosa_relacionada || []).includes(filters.fosa_relacionada)
      : true;
    const matchesZona = filters.zona
      ? (b.taxonomies || []).some(tax => tax.taxonomy === 'zona' && tax.name === filters.zona)
      : true;
    const matchesFecha = filters.fecha
      ? (b.date && b.date.startsWith(filters.fecha))
      : true;
    return matchesHost && matchesFosa && matchesZona && matchesFecha;
  });

  if (loading) {
    return <Loading text="Cargando diarios de campo..." />;
  }

  return (
    <div>
      <h1>Diarios de Campo</h1>
      <div style={{ marginBottom: 16 }}>
        <Button
          appearance="base"
          onClick={() => setShowMap((v) => !v)}
          style={{
            background: showMap ? '#B39EB5' : '#B5EAD7', // pastel morado y verde
            color: '#333',
            border: 'none',
            fontWeight: 'bold',
            minWidth: 140,
            transition: 'background 0.2s'
          }}
        >
          {showMap ? (
            <>
              <span role="img" aria-label="Lista" style={{ marginRight: 8 }}>📋</span>
              Ver como lista
            </>
          ) : (
            <>
              <span role="img" aria-label="Mapa" style={{ marginRight: 8 }}>📍</span>
              Ver en mapa
            </>
          )}
        </Button>
      </div>
      <BitacorasFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        resetFilters={resetFilters}
        getUniqueHosts={getUniqueHosts}
        getUniqueFosas={getUniqueFosas}
        getUniqueZonas={getUniqueZonas}
      />
      {showMap ? (
        <div style={{ marginRight: '5%' }}>
        <BitacorasMap style={{marginRight: "5%"}} bitacoras={filteredBitacoras} />
        </div>
      ) : (
        <Row>
          {filteredBitacoras.map((bitacora) => (
            <BitacoraGridItem key={`${bitacora.host}-${bitacora.type}-${bitacora.id}`} bitacora={bitacora} />
          ))}
        </Row>
      )}
    </div>
  );
}

export default Bitacoras;