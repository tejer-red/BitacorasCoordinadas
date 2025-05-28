import React from 'react';
import { Card, Link } from '@canonical/react-components';

const FosasListItem = ({ fosa, handleTitleClick }) => (
  <li className="p-list__item fosas-list-item">
    <Card
      highlighted
      onClick={() =>
        handleTitleClick &&
        handleTitleClick(
          parseFloat(fosa.meta?.latitud?.[0]),
          parseFloat(fosa.meta?.longitud?.[0])
        )
      }
      style={{ cursor: 'pointer' }}
    >
      <h5 className="p-heading--four fosas-title">{fosa.title}</h5>
      <ul className="p-list--unstyled">
        <li>
          <strong>Colectivo:</strong> {fosa.host}
        </li>
        <li>
          <strong>Fecha:</strong> {new Date(fosa.date).toLocaleDateString()}
        </li>
        <li>
          <strong>Zonas:</strong> {fosa.taxonomies?.map((tax) => tax.name).join(', ')}
        </li>
        <li>
          <Link
            href={`https://${fosa.host}/?p=${fosa.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-link fosas-link"
            onClick={(e) => e.stopPropagation()} // Prevent triggering Card's onClick
          >
            Ver post original
          </Link>
        </li>
      </ul>
    </Card>
  </li>
);

export default FosasListItem;
