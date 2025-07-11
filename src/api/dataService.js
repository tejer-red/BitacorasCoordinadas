import axios from 'axios';

function getBaseUrl() {
  return localStorage.getItem('BASE_URL') || 'https://concentrador.abundis.com.mx';
}

let cachedSummary = null;

export const fetchSummaryData = async () => {
  if (!cachedSummary) {
    while (true) {
      try {
        const url = `${getBaseUrl()}/output/general.json`;
        console.log('Descargando summary desde:', url);
        const { data } = await axios.get(url);
        // Debug: mostrar cuántos items trae el summary
        console.log('fetchSummaryData: items recibidos:', Array.isArray(data) ? data.length : data);
        cachedSummary = data;
        break;
      } catch (error) {
        console.error('Error fetching summary data:', error);
        // Espera 1 segundo antes de volver a intentar
        await new Promise(res => setTimeout(res, 1000));
      }
    }
  }
  return cachedSummary;
};

// Cache para posts individuales
const postCache = new Map();

export const fetchPostDetails = async (host, type, id) => {
  const cacheKey = `${host}/${type}/${id}`;
  if (postCache.has(cacheKey)) {
    return postCache.get(cacheKey);
  }
  const url = `${getBaseUrl()}/output/${host}/${type}/${id}.json`;
  let lastError = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      console.log('Descargando post details desde:', url);
      const { data } = await axios.get(url);
      // Si la respuesta contiene el mensaje de error específico, reintenta
      if (typeof data === 'string' && data.includes('no resource with given identifier found')) {
        const wait = 1000 * Math.pow(2, attempt); // backoff exponencial
        console.warn(`No resource found for ${type}/${id}, esperando ${wait}ms antes de reintentar...`);
        await new Promise(res => setTimeout(res, wait));
        continue;
      }
      postCache.set(cacheKey, data);
      return data;
    } catch (error) {
      lastError = error;
      const status = error?.response?.status;
      if (status === 403 || status === 500 || status === 608) {
        const wait = 1000 * Math.pow(2, attempt); // backoff exponencial
        console.warn(`Error ${status} en ${type}/${id}, esperando ${wait}ms antes de reintentar...`);
        await new Promise(res => setTimeout(res, wait));
      } else if (attempt < 4) {
        const wait = 200 * Math.pow(2, attempt); // backoff exponencial para otros errores
        console.error(`Error fetching post details for ${type}/${id}, attempt ${attempt + 1}:`, error);
        await new Promise(res => setTimeout(res, wait));
      }
    }
  }
  console.error(`Error fetching post details for ${type}/${id}:`, lastError);
  postCache.set(cacheKey, null);
  return null;
};

// Utilidad para limitar concurrencia de promesas
export async function concurrentMap(array, mapper, concurrency = 5) {
  const result = [];
  let idx = 0;
  let running = 0;
  return new Promise((resolve, reject) => {
    function next() {
      if (idx === array.length && running === 0) return resolve(result);
      while (running < concurrency && idx < array.length) {
        const currentIdx = idx++;
        running++;
        Promise.resolve(mapper(array[currentIdx], currentIdx, array))
          .then(res => { result[currentIdx] = res; })
          .catch(reject)
          .finally(() => {
            running--;
            next();
          });
      }
    }
    next();
  });
}