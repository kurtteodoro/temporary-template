import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {brlToFloat, handleMascararReal} from "../../components/utils/FormatacaoReal";
import {Button} from "primereact/button";
import React, {useRef, useState} from "react";
import InputMask from "react-input-mask";
import {formatCNPJ, validCnpj, validCpf} from "../Login/validacoes";
import {copiarVendaParaJSON} from "../../components/utils/Venda";

const CadastrarRateio = function({ open, close, parcela, venda }) {

    const toast = useRef();
    const [nomeBeneficiado, setNomeBeneficiado] = useState('');
    const [CPFBeneficiado, setCPFBeneficiado] = useState('');
    const [errorCPF, setErrorCPF] = useState(false);
    const [valorRateio, setValorRateio] = useState('');
    const [ctrl, setCtrl] = useState(1);
    const [lastCharIs, setLastCharIs] = useState('');
    const [errorValorRateio, setErrorValorRateio] = useState(false);
    const [errorNome, setErrorNome] = useState(false);
    const [loading, setLoading] = useState(false);
    var buff;

    const saveBuff = function(event) {
        buff = event.key;
    }

    const handleCadastrarRateio = async function(event) {
        event.preventDefault();
        var errors = [];

        await toast.current.clear();

        if(nomeBeneficiado.length < 3) {
            errors.push('Insira um nome válido');
            setErrorNome(true);
        }

        if(!validCpf(CPFBeneficiado) && !validCnpj(CPFBeneficiado)) {
            errors.push('CPF/CNPJ Inválido');
            setErrorCPF(true);
        }

        if(brlToFloat(valorRateio) < 3) {
            errors.push('O valor mínimo é de R$ 1,00');
            setErrorValorRateio(true);
        }

        if(errors.length > 0) {
            toast.current.show(errors.map(
                erro => ({ severity: 'error', summary: 'Verifique os seguintes campos', detail: erro, life: 3000 })
            ));
            return 0;
        }

        var _venda = {...venda};
        var indexParcela = _venda.parcelas.findIndex(e => e.id == parcela.id);
        var novoRateio = {
            id: String(Math.floor(Date.now() / 1000)),
            valor: valorRateio,
            beneficiado: nomeBeneficiado,
            DOC: CPFBeneficiado
        };

        if(Array.isArray(_venda.parcelas[indexParcela].rateio))
            _venda.parcelas[indexParcela].rateio.push(novoRateio);
        else
            _venda.parcelas[indexParcela].rateio = [novoRateio];

        setLoading(true);
        console.log(copiarVendaParaJSON(_venda));
    }

    const handleFecharModal = function() {
        close();
    }

    function handleMaskChange(event) {
        setErrorCPF('');
        const valor = event.target.value.replace(/\D/g,'');
        if(lastCharIs && valor.length == 11) {
            setCtrl(2);
            setCPFBeneficiado(valor+buff);
            setTimeout(() => {
                document.querySelector('#inputCNPJRef').value = formatCNPJ(valor+buff);
            }, 50);
        } else {
            setCPFBeneficiado(valor);
            setLastCharIs(valor.length > 10);
        }

        if(valor.length == 11 && ctrl == 2)
            setCtrl(1);
    }

    return (
        <Dialog header={"Cadastrar rateio da parcela #" + parcela?.id} visible={open} onHide={handleFecharModal}>
            <form onSubmit={handleCadastrarRateio}>
                <Toast ref={toast} />
                <div className="grid pt-4">
                    <div className="col-12 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-user" />
                            <InputText value={nomeBeneficiado} onChange={e => {
                                setNomeBeneficiado(e.target.value);
                                setErrorNome(false);
                            }} required type="text" className={errorNome ? "w-full p-invalid" : "w-full"} placeholder="Nome do beneficiado" />
                            <label htmlFor="calendar">Nome do beneficiado</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-id-card" />
                            {
                                ctrl == 1 ?
                                    <InputMask
                                        mask="999.999.999-99"
                                        onChange={handleMaskChange}
                                        value={ CPFBeneficiado }
                                        maskChar=""
                                        noSpaceBetweenChars={true}
                                    >
                                        {(inputProps) => <InputText required className={errorCPF ? 'p-invalid' + " mb-0" : ''} style={{width: '100%'}} onKeyDown={saveBuff} type="text" placeholder="CPF ou CNPJ" />}
                                    </InputMask>
                                    :
                                    <InputMask
                                        mask="99.999.999/9999-99"
                                        onChange={handleMaskChange}
                                        value={ CPFBeneficiado }
                                        maskChar=""
                                        noSpaceBetweenChars={true}
                                    >
                                        {(inputProps) => <InputText required className={errorCPF ? 'p-invalid' + " mb-0" : ''}  style={{width: '100%'}} id="inputCNPJRef" onKeyDown={saveBuff} type="text" placeholder="CPF ou CNPJ" />}
                                    </InputMask>
                            }
                            <label htmlFor="calendar">CPF/CNPJ do beneficiado</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-dollar" />
                            <InputText onChange={e => {
                                    handleMascararReal(e, setValorRateio);
                                    setErrorValorRateio(false);
                                }}
                                value={valorRateio} required className={errorValorRateio ? "w-full p-invalid" : "w-full"} placeholder="Valor do rateio R$" />
                            <label htmlFor="calendar">Valor do rateio R$</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <Button loading={loading} className="p-button-info" icon="pi pi-save" label="Cadastrar rateio" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
}

export default CadastrarRateio;
