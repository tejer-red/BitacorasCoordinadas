// fosas: [{ id: 33, ... }, ...]
// indicios: [{ meta: { fosa_relacionada: ["33"] }, ... }, ...]

export function contarIndiciosPorFosa(indicios) {
  const conteo = {};
  indicios.forEach(indicio => {
    const relacionadas = indicio.meta?.fosa_relacionada || [];
    relacionadas.forEach(fosaId => {
      conteo[fosaId] = (conteo[fosaId] || 0) + 1;
    });
  });
  return conteo;
}

// Uso:
// const conteo = contarIndiciosPorFosa(indicios);
// conteo["33"] // => cantidad de indicios relacionados con la fosa 33