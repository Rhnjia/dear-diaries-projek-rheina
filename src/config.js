const BASE_URL = import.meta.env.PROD 
  ? '' 
  : 'http://localhost:5000';

const API_URL = `${BASE_URL}/api`;

export { BASE_URL, API_URL };
export default API_URL;
