import axios from 'axios';

const SITES_API = 'https://tejer.red/api/registrarInstancia.php'; // URL de tu API principal

export const fetchAllData = async (type) => {
  try {
    const { data: sites } = await axios.get(SITES_API);

    const results = await Promise.allSettled(
      sites.map(async (site) => {
        const originUrl = site.url; // Usar directamente la propiedad `url`
        const data = await axios.get(site.endpoints[type]).then(res => res.data);

        // Obtener detalles de las imágenes asociadas a `featured_media` y taxonomías
        const enrichedData = await Promise.all(
          data.map(async (item) => {
            let tipoPrendaNames = [];
            if (item.tipo_prenda?.length) {
              try {
                const tipoPrendaResponses = await Promise.all(
                  item.tipo_prenda.map(id =>
                    axios.get(`${originUrl}/wp-json/wp/v2/tipo_prenda/${id}`).then(res => res.data.name)
                  )
                );
                tipoPrendaNames = tipoPrendaResponses;
              } catch {
                tipoPrendaNames = [];
              }
            }

            let imageUrl = null;
            if (item.featured_media) {
              try {
                const mediaResponse = await axios.get(`${originUrl}/wp-json/wp/v2/media/${item.featured_media}`);
                imageUrl = mediaResponse.data.source_url;
              } catch {
                imageUrl = null;
              }
            }

            return { ...item, origin: originUrl, imageUrl, tipo_prenda_names: tipoPrendaNames };
          })
        );

        return enrichedData;
      })
    );

    return results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value);

  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};