import {validCnpj, validCpf} from "../../pages/Login/validacoes";
import {formataCNPJ, formataCPF} from "./FormatacaoString";

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
        parcelas: copiarParcelas(v.parcelas),
        status: v.status
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
                texto: parcela.texto,
                valor: parcela.valor,
                rateio: copiarRateio(parcela.rateio)
            });
        })
    }catch(Ex) {}
    return p;
}

export const copiarRateio = function(rateios) {
    var r = [];

    const formatarDocumento = function(doc) {
        if(validCpf(doc)) {
            return formataCPF(doc.replace(/\D/g,''))
        }
        if(validCnpj(doc)) {
            return formataCNPJ(doc.replace(/\D/g,''))
        }
    }

    try {
        rateios.forEach(rateio => {
            r.push({
                id: rateio.id,
                valor: rateio.valor,
                beneficiado: rateio.beneficiado,
                DOC: formatarDocumento(rateio.DOC)
            });
        })
    }catch(Ex) {}
    return r.length > 0 ? r : null;
}
