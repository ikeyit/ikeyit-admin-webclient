import axios from "axios";

let unauthorizedCallback = null;

export const setUnauthorizedCallback = callback => {
    unauthorizedCallback = callback;
};

export const ajax = axios.create({
    timeout: 1000,
});


ajax.interceptors.request.use(config => {
    return config;
}, () => {
    return Promise.reject({errCode: 0, errMsg: '请求错误'});
});

// Add a response interceptor
ajax.interceptors.response.use(response => {
    return response.data;
}, error => {
    if (axios.isCancel(error))
        return Promise.reject({errCode: 0, errMsg: '取消请求'});
    if (error.response) {
        if (error.response.status == 401) {
            if (unauthorizedCallback) {
                unauthorizedCallback();
            }
            return Promise.reject({errCode: 401, errMsg: '需要登录'});
        }
        if (error.response.data)
            return Promise.reject(error.response.data);

    }

    return Promise.reject({errCode: 0, errMsg: '网络错误'});
});