import axios from 'axios';
import fs from 'fs/promises';

const SITES_API = 'https://tejer.red/api/registrarInstancia.php';
const CACHE_FILE = './cache/sitesCache.json';

const generateCache = async () => {
  try {
    const { data: sites } = await axios.get(SITES_API);

    const cacheData = await Promise.all(
      sites.map(async (site) => {
        const originUrl = site.url;

        // Obtener taxonomías y otros datos relevantes
        const taxonomies = {};
        try {
          const tipoPrendaResponse = await axios.get(`${originUrl}/wp-json/wp/v2/tipo_prenda`);
          taxonomies.tipo_prenda = tipoPrendaResponse.data.map((item) => ({
            id: item.id,
            name: item.name,
            link: item.link,
          }));
        } catch {
          taxonomies.tipo_prenda = [];
        }

        return {
          url: originUrl,
          endpoints: site.endpoints,
          taxonomies,
        };
      })
    );

    // Guardar el caché en un archivo JSON
    await fs.writeFile(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log('Caché generado exitosamente.');
  } catch (error) {
    console.error('Error generando el caché:', error);
  }
};

generateCache();
