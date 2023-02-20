function setParams(config) {
    // config - базовый параметр
    // У нас один запрос, но если нужно добавлять параметры в определённые адреса,
    // Тогда нужно ставить условие
    const params = config.params || {};
    config.params = Object.assign(params, {
        apikey: process.env.VUE_APP_API_KEY,
        plot: 'full',
    });
    return config;
//    Object.assign(target, src1, src2)
//    target - куда будут склеиваться объекты
}

function returnData(res) {
    return res.data;
//    Так как у нас response имеет много параметров, нам нужно его сжать
}

export default function (axios) {
    axios.interceptors.request.use(setParams);
    axios.interceptors.response.use(returnData);
}