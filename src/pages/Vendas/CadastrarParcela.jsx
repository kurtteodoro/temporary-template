import {InputText} from "primereact/inputtext";
import React, {useEffect, useRef, useState} from "react";
import {Calendar} from "primereact/calendar";
import {Button} from "primereact/button";
import {brlToFloat, floatToBrl, handleMascararReal} from "../../components/utils/FormatacaoReal";
import {Toast} from "primereact/toast";
import moment from "moment";
import VendaServiceAPI from "../../service/VendaServiceAPI";
import {copiarVendaParaJSON} from "../../components/utils/Venda";

const CadastrarParcela = function({ venda, refresh, parcelaEditando, voltar }) {

    const [dataVencimento, setDataVencimento] = useState();
    const [errorDataVencimento, setErrorDataVencimento] = useState(false);
    const [errorValorParcela, setErrorValorParcela] = useState(false);
    const [valorParcela, setValorParcela] = useState();
    const [quantidadeReplicasParcela, setQuantidadeReplicasParcela] = useState(1);
    const toast = useRef();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(parcelaEditando) {
            setDataVencimento(
                moment(parcelaEditando.dataVencimento.split('/').reverse().join('-')).toDate()
            );
            setValorParcela(String(parcelaEditando.valor).replace('R$', '').trim());
        }
    }, [parcelaEditando])

    const handleCadastrarParcela = async function(e) {
        e.preventDefault();
        var errors = [];
        await toast.current.clear();

        if(!dataVencimento) {
            errors.push("Insira uma data de vencimento válida");
            setErrorDataVencimento(true);
        }

        if(brlToFloat(valorParcela) < 1 || !brlToFloat(valorParcela) || valorParcela[0] == ',') {
            errors.push("O valor da parcela deve ser maior que R$ 0,99");
            setErrorValorParcela(true);
        }

        if(errors.length > 0) {
            toast.current.show(errors.map(
                erro => ({ severity: 'error', summary: 'Verifique os seguintes campos', detail: erro, life: 3000 })
            ));
            return 0;
        }

        if(parcelaEditando) {
            var parcelaEditada = venda.parcelas.find(e => e.id == parcelaEditando.id);
            parcelaEditada.dataVencimento = moment(dataVencimento).format('DD-MM-YYYY');
            parcelaEditada.valor = "R$ " + valorParcela;
        }

        var data = copiarVendaParaJSON(venda);

        if(!parcelaEditando) {
            data.parcelas = [
                ...data?.parcelas ?? [],
                ...gerarParcelas() ?? []
            ];
        }

        const vendaServiceAPI = new VendaServiceAPI();

        try {
            setLoading(true);
            const res = await vendaServiceAPI.atualizarVenda(data, venda.id);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Parcelas cadastradas com sucesso', life: 3000 });
            setValorParcela('');
            await refresh();
            voltar();
        }catch(ex) {
            toast.current.show({ severity: 'error', summary: 'Erro desconhecido', detail: 'Ops, houve um erro desconhecido, tente novamente', life: 3000 });
        }

        setLoading(false);

    }

    const gerarParcelas = function() {
        var __parcelas = [];
        var id = Math.floor(Date.now() / 1000);
        for (var i = 0; i < quantidadeReplicasParcela; ++i) {
            __parcelas.push({
                "id": id+i,
                "dataVencimento": moment(dataVencimento).add('month', i).format('DD-MM-YYYY'),
                "valor": "R$ " + valorParcela,
                "formaPgto": "boleto",
                "dadosPgto": "informacao nao disponivel",
                "dataLimitePagamento": moment(dataVencimento).add('days', 3).format('DD-MM-YYYY'),
                "desconto": 0,
                "texto": "Não receber após o vencimento",
                "rateio": null
            });
        }
        return __parcelas;
    }

    return(
        <form onSubmit={handleCadastrarParcela}>
            <Toast ref={toast} />
            {
                parcelaEditando && (
                    <h6>Editando parcela: #{parcelaEditando.id}</h6>
                )
            }
            <div className="grid pt-4">
                <div className="col-12 mb-3">
                    <span className="p-input-icon-right block p-float-label">
                        <i className="pi pi-calendar" />
                        <Calendar dateFormat="dd/mm/yy" value={dataVencimento} onChange={e => {
                            setDataVencimento(e.value);
                            setErrorDataVencimento(false);
                        }} locale="pt_BR" id="calendar" placeholder="Data de vencimento da parcela" className={errorDataVencimento ? 'w-full p-invalid' : 'w-full'} ></Calendar>
                        <label htmlFor="calendar">Data de vencimento da parcela</label>
                    </span>
                </div>
                <div className={ parcelaEditando ? "col-12 mb-3" : "col-6 mb-3" }>
                    <span className="p-input-icon-right block p-float-label">
                        <i className="pi pi-dollar" />
                        <InputText value={valorParcela} onChange={e => {
                            handleMascararReal(e, setValorParcela);
                            setErrorValorParcela(false);
                        }} required type="text" className={errorValorParcela ? 'w-full p-invalid' : 'w-full'} placeholder="Valor da parcela R$" />
                        <label>Valor da parcela R$</label>
                    </span>
                </div>
                {
                    !parcelaEditando && (
                        <div className="col-6 mb-3">
                            <span className="p-input-icon-right block p-float-label">
                                <i className="pi pi-th-large" />
                                <InputText value={quantidadeReplicasParcela} onChange={e => setQuantidadeReplicasParcela(e.target.value)} min="1" required type="number" className="w-full" placeholder="Replicas da parcela" />
                                <label htmlFor="username">Replicas da parcela</label>
                            </span>
                        </div>
                    )
                }
                <div className="col-6">
                    <Button loading={loading} type="submit" icon="pi pi-save" label={parcelaEditando ? "Editar parcela" : "Cadastrar parcela"} className="p-button-info" />
                </div>
            </div>
        </form>
    );
}

export default CadastrarParcela;
