import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';

function Bitacoras() {
  const [bitacoras, setBitacoras] = useState([]);

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

      setBitacoras(details.filter(item => item !== null));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Bitácoras</h1>
      <ul>
        {bitacoras.map((bitacora) => (
          <li key={bitacora.id}>
            <h2>{bitacora.title}</h2>
            <p><strong>Colectivo autor:</strong> {bitacora.host}</p>
            <img
              src={bitacora.media_url || bitacora.image}
              alt={bitacora.title}
              style={{ maxWidth: '300px', width: '100%' }}
            />
            <p><strong>Fecha:</strong> {new Date(bitacora.date).toLocaleDateString()}</p>
            <p><strong>Slug:</strong> {bitacora.slug}</p>
            <p><strong>Latitud:</strong> {bitacora.meta?.latitud?.[0]}</p>
            <p><strong>Longitud:</strong> {bitacora.meta?.longitud?.[0]}</p>
            <p><strong>Zona:</strong> {bitacora.taxonomies?.map(tax => tax.name).join(', ')}</p>
            {bitacora.meta?.gallery_urls?.length > 0 && (
              <div>
                <strong>Galería:</strong>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {bitacora.meta.gallery_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Galería ${index + 1}`}
                      style={{ maxWidth: '100px', height: 'auto' }}
                    />
                  ))}
                </div>
              </div>
            )}
            <a
              href={`https://${bitacora.host}/?p=${bitacora.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver post original
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Bitacoras;