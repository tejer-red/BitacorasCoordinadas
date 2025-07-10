import axios from 'axios';

function getBaseUrl() {
  return localStorage.getItem('BASE_URL') || 'https://concentrador.abundis.com.mx';
}

let cachedSummary = null;

export const fetchSummaryData = async () => {
  if (!cachedSummary) {
    try {
      const { data } = await axios.get(`${getBaseUrl()}/output/general.json`);
      cachedSummary = data;
    } catch (error) {
      console.error('Error fetching summary data:', error);
      cachedSummary = [];
    }
  }
  return cachedSummary;
};

export const fetchPostDetails = async (host, type, id) => {
  try {
    const { data } = await axios.get(`${getBaseUrl()}/output/${host}/${type}/${id}.json`);
    return data;
  } catch (error) {
    console.error(`Error fetching post details for ${type}/${id}:`, error);
    return null;
  }
};