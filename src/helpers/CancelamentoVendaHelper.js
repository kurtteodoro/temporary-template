export default class CancelamentoVendasHelper {
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
      return parcelas.map((parcela) => {
        const { id: parcelaId, status, valor } = parcela;
        const descricao = `Parcela ${parcelaId}, rateios ${parcelas.length}`;
    
        return {
          key: Date.now() * -1,
          data: {
            id: parcelaId,
            status: status,
            valor: valor,
            descricao: descricao,
          },
        };
      });
    }

 
     toDTOCancelamentoVenda(remessaSelecionada) {
         const values = Object.keys(remessaSelecionada)
         .filter((key) => parseInt(key) > 0)
         .map((key) => parseInt(key));
      
         const dto = {
             idVendas: values,
         };
      
         return dto;
    }


      obterVendasComStatusRegistrada(data) {
         const filteredData = data.filter((venda) => venda.statusVenda.toUpperCase() === "REGISTRADA");      
         const vendasComBoletosEmitidos = filteredData.filter((venda) => {
         const parcelas = venda.parcelas.filter((parcela) => parcela.status.toUpperCase() === "BOLETO EMITIDO");
            return parcelas.length > 0;
         });
      
         return vendasComBoletosEmitidos;
    }

     temRemessaComBoletoRegistrado(data){
        const value = this.obterVendasComStatusRegistrada(data)
        return value.length > 0 
     }
}

   