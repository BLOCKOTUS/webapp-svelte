import axios from 'axios';

export const getVerificator = async() => {
    const response = 
        await axios
            .get('http://localhost:3000/identity/verificators')
            .catch(e => {
                return Promise.reject(e)
            })


    return JSON.parse(response).data;
};