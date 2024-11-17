import BaseService from './BaseService'
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

const ApiService = {
    fetchData<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>
    ) {
        return new Promise<AxiosResponse<Response>>((resolve, reject) => {
            // Retrieve the token from local storage
            const token = localStorage.getItem('token');

            // Add the Authorization header to the request config
            if (token) {
                param.headers = {
                    ...param.headers,
                    'Authorization': `Bearer ${token}`,
                };
            }
            // Log the request for debugging
            console.log('Request URL:', param.url);
            console.log('Authorization Header:', param.headers?.Authorization);
            BaseService(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response)
                })
                .catch((errors: AxiosError) => {
                    reject(errors)
                })
        })
    },
}

export default ApiService