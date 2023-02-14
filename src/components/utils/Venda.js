export const copiarVendaParaJSON = function(v) {
    return {
        codigo: v.codigo,
        sellerId: v.sellerId,
        unidade: v.unidade,
        dataVenda: v.dataVenda.replace(/\//g, '-'),
        DOCCliente: v.DOCCliente,
        nomeCliente: v.nomeCliente,
        emailCliente: v.emailCliente,
        numeroContrato: v.numeroContrato,
        endereco: v.endereco,
        numero: v.numero,
        enviada: null,
        complemento: v.complemento,
        bairro: v.bairro,
        cidade: v.cidade,
        estado: v.estado,
        cep: v.cep,
        numeroDeParcelas: v.qtdParcelas,
        valorDaVenda: v.valorDaVenda,
        valor: v.valor,
        dataCriacaoVenda: v.dataCriacaoVenda.replace(/\//g, '-'),
        parcelas: copiarParcelas(v.parcelas)
    }
}

export const copiarParcelas = function(parcelas) {
    var p = [];
    try {
        parcelas.forEach(parcela => {
            p.push({
                dadosPgto: parcela.dadosPgto,
                dataLimitePagamento: parcela.dataLimitePagamento,
                dataVencimento: parcela.dataVencimento,
                desconto: parcela.desconto,
                formaPgto: parcela.formaPgto,
                id: parcela.id,
                rateio: parcela.rateio,
                texto: parcela.texto,
                valor: parcela.valor
            });
        })
    }catch(Ex) {}
    return p;
}
