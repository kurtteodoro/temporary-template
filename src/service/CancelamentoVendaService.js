import ServiceBaseAPI from "./ServiceAPI";
export default class CancelamentoVendasService extends ServiceBaseAPI  {

    async  callExtratoVendas() {
       const url = "https://pagadoria.imobibankbrasil.com.br/api/v1/extrato/vendas?allusers=true";
       return await this.http().get(url);
    }

    async callCancelamentoVenda(data){

      return await this.http().delete('https://pagadoria.imobibankbrasil.com.br/api/v1/pagamentos/remessa', 
      {
         data       
      }
   );
    }

    /**
     *  async cadastrarVenda(data) {
        return await this.http().post('https://remessa.imobibankbrasil.com.br/v1/remessas', data, {
            headers: {
                'idEmpresa': JSON.parse(localStorage.getItem('@usuario')).empresa_id,
                'idUsuario': JSON.parse(localStorage.getItem('@usuario')).usuario_id
            }
        });
    }
     * 
     * 
     */
    
    
 }

 