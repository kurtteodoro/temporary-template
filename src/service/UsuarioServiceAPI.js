import ServiceAPI from './ServiceAPI.js';
import qs from "qs";

export default class UsuarioServiceAPI extends ServiceAPI {

    async logarUsuario(login, senha) {
        login = login.replace(/\D/g,'');
        return await this.http().post('https://seguranca.imobibankbrasil.com.br/oauth/token', qs.stringify({
            grant_type: "password",
            username: login,
            password: senha
        }), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(`ed4af4c3-d281-4968-bdac-e334b551d06a:cfb96cc6-8efe-4012-abe3-7eb023add6ba`),
            },
        });
    }

}
