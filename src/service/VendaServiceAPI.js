import ServiceAPI from './ServiceAPI.js';
import qs from "qs";
import axios from "axios";

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

    async atualizarVenda(data, venda_id) {
        return await this.http().put('https://remessa.imobibankbrasil.com.br/v1/remessas/'+venda_id, data, {
            headers: {
                'idremessa': 0,
                'status': 0
            }
        });
    }

    async excluirVenda(venda_id) {
        return await axios.delete('https://remessa.imobibankbrasil.com.br/v1/remessas/'+venda_id);
    }
    
    async gerarRemessas(data) {
        return await this.http().post('https://pagadoria.imobibankbrasil.com.br/api/v1/pagamentos/remessa', data);
    }

    async usuarioPermiteRateio(doc) {
        return await this.http().get(`https://adm.imobibankbrasil.com.br/api/v1/empresa/usuario/${doc.replace(/\D/g,'')}/rateio/habilitado`);
    }

}
