import ServiceBaseAPI from "./ServiceAPI";
export default class CancelamentoVendasService extends ServiceBaseAPI  {

    async  callExtratoVendas() {
       const url = "https://pagadoria.imobibankbrasil.com.br/api/v1/extrato/vendas?allusers=true";
       return await this.http().get(url);
    }
 
    toTreeExtrato(extrato) {
       const treeExtrato = [];
       extrato.forEach(element => {
          const { id, unidade, parcelas, dataVenda, statusVenda } = element;
          const totalVendas = parcelas.reduce((sum, item) => sum + item.valor, 0);
 
          const dadosTree = {
             key: `${id}`,
             data: {
                id: id,
                status: statusVenda,
                descricao: unidade,
                data: dataVenda,
                valor: totalVendas,
             },
             children: this.parcelaToChildren(parcelas, id),
          };
          treeExtrato.push(dadosTree);
       });
 
       return treeExtrato;
    }
 
    parcelaToChildren(parcelas, id) {
       const childrenParcelas = [];
       const tamanhoRateio = parcelas.length;
 
       parcelas.forEach(element => {
          const { id: parcelaId, status, valor } = element;
          const dados = {
             key: Date.now() * -1,
             data: {
                id: parcelaId,
                status: status,
                valor: valor,
                descricao: `Parcela ${parcelaId}, rateios ${tamanhoRateio}`,
             },
          };
          childrenParcelas.push(dados);
       });
 
       return childrenParcelas;
    }

    enviarRemessaCancelamento(remessaSelecionada){
        let values = Object.entries(remessaSelecionada).
                map(entry => entry[0]).
                    filter(v=> parseInt(v) > 0).
                        map(v=> parseInt(v))        
        console.log(values)
    }
 }

 