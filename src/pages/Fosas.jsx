import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';

function Fosas() {
  const [fosas, setFosas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'fosas');

      const details = await Promise.all(
        filtered.map(async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          if (detail) {
            console.log('Fosa Object:', detail); // Log the full object
          }
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        })
      );

      setFosas(details.filter(item => item !== null));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Fosas</h1>
      <ul>
        {fosas.map((fosa) => (
          <li key={fosa.id}>
            <h2>{fosa.title}</h2>
            <p><strong>Colectivo autor:</strong> {fosa.host}</p>
            <img
              src={fosa.media_url || fosa.image}
              alt={fosa.title}
              style={{ maxWidth: '300px', width: '100%' }}
            />
            <p><strong>Fecha:</strong> {new Date(fosa.date).toLocaleDateString()}</p>
            <p><strong>Slug:</strong> {fosa.slug}</p>
            <p><strong>Latitud:</strong> {fosa.meta?.latitud?.[0]}</p>
            <p><strong>Longitud:</strong> {fosa.meta?.longitud?.[0]}</p>
            <p><strong>Zonas:</strong> {fosa.taxonomies?.map(tax => tax.name).join(', ')}</p>
            <a
              href={`https://${fosa.host}/?p=${fosa.id}`}
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

export default Fosas;
