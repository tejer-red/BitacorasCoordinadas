import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';
import { Spinner, Row } from '@canonical/react-components';
import BitacoraGridItem from '../components/BitacoraGridItem';

function Bitacoras() {
  const [bitacoras, setBitacoras] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'bitacoras');

      const details = await Promise.all(
        filtered.map(async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          if (detail) {
            console.log('Bitácora Object:', detail); // Log the full object
          }
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        })
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Spinner text="Cargando diarios de campo..." />
      </div>
    );
  }

  console.log('Bitácoras:', bitacoras); // Log the array of bitácoras

  return (
    <div>
      <h1>Diarios de Campo</h1>
      <Row>
        {bitacoras.map((bitacora) => (
          <BitacoraGridItem key={`${bitacora.host}-${bitacora.type}-${bitacora.id}`} bitacora={bitacora} />
        ))}
      </Row>
    </div>
  );
}

export default Bitacoras;