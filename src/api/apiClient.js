import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_BASEURL,
})

apiClient.interceptors.request.use((config)=>{
    // const token = localStorage.getItem('token');
    // if(token){
    //     config.headers
    // }
    return config;
}, (error)=>{
    return Promise.reject(error);
})


apiClient.interceptors.response.use(
    (response) => {
      
      return response;
    },
    (error) => {
     
      if (error.response?.status === 401) {
        
      }
      return Promise.reject(error);
    }
  );
  
  export default apiClient;