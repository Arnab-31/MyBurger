import axios from 'axios';

const instance  = axios.create({
    baseURL: 'https://myburger-react-92b91-default-rtdb.firebaseio.com/'
});

export default instance;