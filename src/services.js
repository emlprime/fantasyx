import axios from 'axios';

export const server = axios.create({
    baseURL: `http://localhost:5000/api/v1/`
});

export default {
    server: {
        get: (url) => server ({method: `GET`, url}),
        post: (url, data) => server ({method: `POST`, url, data})
    }
}
