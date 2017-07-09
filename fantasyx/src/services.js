import axios from 'axios';

export const server = axios.create({
    baseURL: `http://localhost:5000/api/v1/`
});

export default {
    server: {
        get: (url, data) => server ({method: `GET`, url, data}),
        post: (url, data) => server ({method: `POST`, url, data})
    }
}
