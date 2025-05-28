import React from 'react';
import { Card, Button, Col } from '@canonical/react-components';

const BitacoraGridItem = ({ bitacora }) => (
  <Col size="3" key={`${bitacora.host}-${bitacora.type}-${bitacora.id}`}>
    <Card
      title={<h4 className="p-heading--five">{bitacora.title}</h4>}
      image={{
        src: bitacora.media_url || bitacora.image,
        alt: bitacora.title,
      }}
      highlighted
    >
      <p><strong>Colectivo autor:</strong> {bitacora.host}</p>
      <p><strong>Fecha:</strong> {new Date(bitacora.date).toLocaleDateString()}</p>
      <p><strong>Zona:</strong> {bitacora.taxonomies?.map((tax) => tax.name).join(', ')}</p>
      {bitacora.meta?.gallery_urls?.length > 0 && (
        <div>
          <strong>Galería:</strong>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
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
      <Button
        appearance="positive"
        href={`https://${bitacora.host}/?p=${bitacora.id}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Ver post original
      </Button>
    </Card>
  </Col>
);

export default BitacoraGridItem;
