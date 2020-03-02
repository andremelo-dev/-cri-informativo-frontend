import axios from 'axios';
let host = process.env.REACT_APP_HOST_DEV;
if(process.env.NODE_ENV == 'production'){ host = process.env.REACT_APP_HOST_PROD;}
const api = axios.create({
    baseURL: host,
    headers:{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('cri_informativo_token')
    }
 });
export default api;