import React from 'react';
import { Card } from '@canonical/react-components';

const IndicioGridItem = ({ indicio }) => (
  <Card
    highlighted
    className="p-card--highlighted"
    {...Object.fromEntries(
      indicio.taxonomies.map((tax) => [`data-${tax.taxonomy}`, tax.slug])
    )}
  >
    {(indicio.media_url || indicio.image) && (
        <a href={`https://${indicio.host}/?p=${indicio.id}`} className="p-card__image-link">
        <img
            src={indicio.media_url || indicio.image}
            alt={indicio.title}
            className="p-card__image"
        />
        </a>
    )}
    <div className="p-card__inner">
      <h3 className="p-heading--four">
        <a href={`https://${indicio.host}/?p=${indicio.id}`} className="p-link--inverted">
          {indicio.title}
        </a>
      </h3>
      <p className="p-card__content">
        <strong>Colectivo autor:</strong> {indicio.host}
      </p>
      <p className="p-card__content">
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
        className="p-button--positive"
      >
        Ver indicio en sitio original
      </a>
    </div>
  </Card>
);

export default IndicioGridItem;
