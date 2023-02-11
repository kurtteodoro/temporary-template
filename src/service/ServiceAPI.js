import axios from "axios";

const Http = axios.create()
Http.defaults.baseURL = 'http://localhost:8000/api'

export default class ServiceBaseAPI {

    constructor() {
        Http.defaults.headers = {
            "Authorization": "Bearer " + localStorage.getItem('@token')?.trim(),
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        Http.interceptors.response.use((response) => response, (error) => {
            console.log(error, "ERROR");
            if(error?.response?.status == 401 && localStorage.getItem('@token')) {
                alert("Sessão expirada");
                localStorage.clear();
                window.location.href = "/#/login";
            }
            return Promise.reject(error);
        });
    }

    getData (res){
        return res.data
    }

    http(){
        return Http
    }

}
