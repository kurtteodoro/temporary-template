import ServiceAPI from './ServiceAPI.js';
import qs from "qs";

export default class VendaServiceAPI extends ServiceAPI {

    async buscarVendas(empresa_id) {
        return await this.http().get('https://remessa.imobibankbrasil.com.br/v1/remessas', {
            headers: {
                'idEmpresa': JSON.parse(localStorage.getItem('@usuario')).empresa_id,
            }
        });
    }

    async cadastrarVenda(data) {
        return await this.http().post('https://remessa.imobibankbrasil.com.br/v1/remessas', data, {
            headers: {
                'idEmpresa': JSON.parse(localStorage.getItem('@usuario')).empresa_id,
                'idUsuario': JSON.parse(localStorage.getItem('@usuario')).usuario_id
            }
        });
    }

}
