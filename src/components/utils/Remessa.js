import {validCnpj, validCpf} from "../../pages/Login/validacoes";
import {formataCNPJ, formataCPF} from "./FormatacaoString";
import {brlToFloat} from "./FormatacaoReal";

export const copiarVendaParaJSONRemessa = function(v, venda_id) {
    return {
        codigo: venda_id,
        unidade: v.unidade,
        dataVenda: v.dataVenda.replace(/\//g, '-').split('-').reverse().join('/'),
        DOCCliente: v.DOCCliente,
        nomeCliente: v.nomeCliente,
        emailCliente: v.emailCliente,
        endereco: v.endereco,
        numero: v.numero,
        complemento: v.complemento,
        bairro: v.bairro,
        cidade: v.cidade,
        estado: v.estado,
        cep: v.cep.replace(/\D/g,''),
        parcelas: copiarParcelas(v.parcelas),
    }
}

export const copiarParcelas = function(parcelas) {
    var p = [];
    try {
        parcelas.forEach(parcela => {
            p.push({
                dadosPgto: parcela.dadosPgto,
                dataLimitePagamento: parcela.dataLimitePagamento.replace(/\//g, '-').split('-').reverse().join('/'),
                dataVencimento: parcela.dataVencimento.replace(/\//g, '-').split('-').reverse().join('/'),
                desconto: parcela.desconto,
                formaPgto: parcela.formaPgto,
                id: parcela.id,
                texto: parcela.texto.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
                valor: brlToFloat(parcela.valor),
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
                id: parseInt(rateio.id),
                valor: brlToFloat(rateio.valor),
                beneficiado: rateio.beneficiado,
                DOC: rateio.DOC.replace(/\D/g,'')
            });
        })
    }catch(Ex) {}
    return r.length > 0 ? r : null;
}
