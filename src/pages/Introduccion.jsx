import React from 'react';

function Introduccion() {
  return (
    <div>
      <h1>Coordinadas</h1>
      <p>
        <strong>Bitácoras Coordinadas</strong> es una plataforma colaborativa que conecta las distintas instancias de la{' '}
        <a href="https://bitacorabusqueda.tejer.red/">Bitácora de Búsqueda</a>, una herramienta digital creada por y para colectivos de búsqueda de personas desaparecidas en México.
      </p>
      <p>
        Cada colectivo mantiene su propia bitácora: un sitio independiente y seguro donde puede registrar, organizar y resguardar información sensible sobre sus hallazgos. Estos incluyen tanto{' '}
        <a href="/fosas"><strong>fosas comunes</strong></a>, con detalles como ubicación, fecha y contexto, como{' '}
        <a href="/indicios"><strong>indicios</strong></a>, es decir, objetos o restos localizados durante las jornadas de búsqueda.
      </p>
      <p>
        Cuando los colectivos deciden compartir parte de esa información públicamente, los datos se integran —de forma segura, voluntaria y descentralizada— en este espacio común: una plataforma que permite ver el conjunto de esfuerzos en mapas, listados y buscadores filtrables.
      </p>
      <h2>¿Qué permite Bitácoras Coordinadas?</h2>
      <ul>
        <li>Reunir información pública de múltiples colectivos sin perder la autonomía de cada uno.</li>
        <li>Visibilizar los hallazgos colectivos mediante mapas interactivos, listados y filtros por fecha, región o tipo de objeto.</li>
        <li>Construir, desde abajo, un censo alternativo, participativo y autogestionado de fosas e indicios.</li>
      </ul>
      <h2>¿Cómo funciona?</h2>
      <p>
        La plataforma utiliza la <strong>API REST</strong> de cada Bitácora de Búsqueda para acceder únicamente a los datos que cada colectivo decide compartir. No se centraliza ni se migra la base completa, respetando así la soberanía técnica de cada instancia.
      </p>
      <h2>Explora los registros</h2>
      <ul>
        <li>👉 <a href="/diarios">Diarios de Campo</a></li>
        <li>👉 <a href="/fosas">Fosas comunes</a></li>
        <li>👉 <a href="/indicios">Indicios encontrados</a></li>
      </ul>
      <hr />
      <p>
        Este es un esfuerzo conjunto, vivo y en expansión. Cada nueva bitácora que se suma fortalece la red de memoria y búsqueda construida desde el territorio.
      </p>
    </div>
  );
}

export default Introduccion;
