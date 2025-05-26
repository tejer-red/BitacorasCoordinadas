import React, { useEffect, useState } from 'react';
import { fetchSummaryData, fetchPostDetails } from '../api/dataService';

function Indicios() {
  const [indicios, setIndicios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const summary = await fetchSummaryData();
      const filtered = summary.filter(item => item.type === 'indicios');

      const details = await Promise.all(
        filtered.map(async (item) => {
          const detail = await fetchPostDetails(item.host, item.type, item.id);
          if (detail) {
            console.log('Indicio Object:', detail); // Log the full object
          }
          return detail ? { ...detail, host: item.host, type: item.type, id: item.id } : null;
        })
      );

      setIndicios(details.filter(item => item !== null));
    };

    fetchData();
  }, []);

  const formatTaxonomies = (taxonomies) => {
    const taxonomyMap = {
      tipo_prenda: 'Tipo de Prenda',
      color: 'Color',
      marca: 'Marca',
      talla: 'Talla',
      material: 'Material',
    };

    return taxonomies.map(tax => ({
      label: taxonomyMap[tax.taxonomy] || tax.taxonomy,
      value: tax.name,
    }));
  };

  return (
    <div>
      <h1>Indicios</h1>
      <ul>
        {indicios.map((indicio) => (
          <li key={indicio.id}>
            <h2>{indicio.title}</h2>
            <p><strong>Colectivo autor:</strong> {indicio.host}</p>
            <img
              src={indicio.media_url || indicio.image}
              alt={indicio.title}
              style={{ maxWidth: '300px', width: '100%' }}
            />
            <p><strong>Fecha:</strong> {new Date(indicio.date).toLocaleDateString()}</p>
            <p><strong>Slug:</strong> {indicio.slug}</p>
            <p><strong>Fecha de Descubrimiento:</strong> {indicio.meta?.fecha_descubrimiento?.[0]}</p>
            <p><strong>Descripción:</strong> {indicio.meta?.descripcion?.[0]}</p>
            <p><strong>Fosa Relacionada:</strong> {indicio.meta?.fosa_relacionada?.join(', ')}</p>
            <ul>
              {formatTaxonomies(indicio.taxonomies).map((tax, index) => (
                <li key={index}>
                  <strong>{tax.label}:</strong> {tax.value}
                </li>
              ))}
            </ul>
            <a
              href={`https://${indicio.host}/?p=${indicio.id}`}
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

export default Indicios;
