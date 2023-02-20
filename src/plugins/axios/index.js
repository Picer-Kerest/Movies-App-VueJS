import axios from "axios";
import interceptors from './interceptors';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    // params: {
    //     apikey: process.env.VUE_APP_API_KEY,
    //     plot: 'full',
    // },
//    Можно так или с помощью iterceptors
});

interceptors(instance);
// Делается для проставления params, если параметры не вставляются в create
// В моём случае параметры проставляются, поэтому потребности в дополнительной функции нет

export default instance;