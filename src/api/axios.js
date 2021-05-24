import axios from 'axios';
import Config from 'react-native-config';

const apiAxios = axios.create({});

const successStatus = (status) => status >= 200 && status < 300;

apiAxios.defaults.validateStatus = (status) => successStatus(status);
apiAxios.defaults.headers.common['LEXIKON-API-KEY'] = Config.LEXIKON_API_KEY;

const handleError = (error) => {
  if (error?.response?.data?.statusCode >= 400 && error.response.data.message) {
    return new Error(error.response.data.message);
  }
  return new Error('Server error');
};

const get = async (url, options) => {
  try {
    return await apiAxios.get(url, options);
  } catch (error) {
    throw handleError(error);
  }
};

const post = async (url, body, options) => {
  try {
    return await apiAxios.post(url, body, options);
  } catch (error) {
    throw handleError(error);
  }
};
const patch = async (url, body, options) => {
  try {
    return await apiAxios.patch(url, body, options);
  } catch (error) {
    throw handleError(error);
  }
};

const del = (url, body) => apiAxios.delete(url, body);

const put = async (url, body) => {
  try {
    return await apiAxios.put(url, body);
  } catch (error) {
    throw handleError(error);
  }
};

export default {
  apiAxios,
  get,
  patch,
  post,
  del,
  put,
};
