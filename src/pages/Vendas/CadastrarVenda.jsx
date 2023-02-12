import {Dialog} from "primereact/dialog";
import React, {useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Calendar} from "primereact/calendar";

import { locale, addLocale, updateLocaleOption, updateLocaleOptions, localeOption, localeOptions } from 'primereact/api';
import InputMask from "react-input-mask";
import {validCpf} from "../Login/validacoes";
import {brlToFloat, floatToBrl, handleMascararReal} from "../../components/utils/FormatacaoReal";
import {Toast} from "primereact/toast";
import moment from "moment";
import VendaServiceAPI from "../../service/VendaServiceAPI";
import jwt_decode from "jwt-decode";

const CadastrarVenda = function({ open, close }) {

    const [nomeProduto, setNomeProduto] = useState('');
    const [dataVenda, setDataVenda] = useState();
    const [cpfCliente, setCpfCliente] = useState('');
    const [numeroCliente, setNumeroCliente] = useState('');
    const [nomeCliente, setNomeCliente] = useState('');
    const [emailCliente, setEmailCliente] = useState('');
    const [enderecoCliente, setEnderecoCliente] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [cepVenda, setCepVenda] = useState('');
    const [valorVenda, setValorVenda] = useState();
    const [valorIntermediacao, setValorIntermediacao] = useState();
    const [numeroParcelas, setNumeroParcelas] = useState('');
    const [numeroContrato, setNumeroContrato] = useState('');

    const [errorCPF, setErrorCPF] = useState(false);
    const [errorDataVenda, setErrorDataVenda] = useState(false);
    const [errorCEP, setErrorCEP] = useState(false);
    const [errorValorVenda, setErrorValorVenda] = useState(false);
    const [errorValorIntermediacao, setErrorValorIntermediacao] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef();

    const handleCadastrarVenda = async function(event) {
        event.preventDefault();
        var errors = [];
        await toast.current.clear();

        if(!validCpf(cpfCliente)) {
            setErrorCPF(true);
            errors.push("Insira um CPF válido");
        }

        if(!dataVenda) {
            setErrorDataVenda(true);
            errors.push("Insira uma data de venda válida");
        }

        if(cepVenda.replace(/[^\d]+/g, "").length !== 8) {
            setErrorCEP(true);
            errors.push("Insira um CEP válido");
        }

        if(brlToFloat(valorVenda) < 1) {
            setErrorValorVenda(true);
            errors.push("Insira o valor da venda");
        }

        if(brlToFloat(valorIntermediacao) < 1) {
            setErrorValorIntermediacao(true);
            errors.push("Insira o valor da intermediação");
        }

        if(brlToFloat(valorVenda) < brlToFloat(valorIntermediacao)) {
            setErrorValorIntermediacao(true);
            errors.push("O valor da intermediação não pode ser maior que o da venda");
        }

        if(errors.length > 0) {
            toast.current.show(errors.map(
                erro => ({ severity: 'error', summary: 'Verifique o seguintes campo', detail: erro, life: 3000 })
            ));
            return 0;
        }

        const data = {
            DOCCliente: cpfCliente,
            bairro: bairro,
            cep: cepVenda,
            cidade: cidade,
            complemento: complemento,
            dataCriacaoVenda: moment().format('DD-MM-YYYY'),
            dataVenda: moment(dataVenda).format('DD-MM-YYYY'),
            emailCliente: emailCliente,
            endereco: enderecoCliente,
            enviada: null,
            estado: estado,
            nomeCliente: nomeCliente,
            numero: numeroCliente,
            numeroContrato: numeroContrato,
            codigo: 423423,
            numeroDeParcelas: numeroParcelas,
            parcelas: null,
            sellerId: JSON.parse(localStorage.getItem("@usuario")).seller_id,
            unidade: nomeProduto,
            valor: brlToFloat(valorIntermediacao).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
            valorDaVenda: brlToFloat(valorVenda).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}),
        }

        const vendaServiceAPI = new VendaServiceAPI();

        try {
            setLoading(true);
            const res = await vendaServiceAPI.cadastrarVenda(data);
            setLoading(false);
            setNomeProduto('');
            setCpfCliente('');
            setNumeroCliente('');
            setNomeCliente('');
            setEmailCliente('');
            setEnderecoCliente('');
            setComplemento('');
            setBairro('');
            setCidade('');
            setEstado('');
            setCepVenda('');
            setValorVenda('');
            setValorIntermediacao('');
            setNumeroParcelas('');
            setNumeroContrato('');
            close(data);
        } catch (ex) {
            toast.current.show({ severity: 'error', summary: 'Tente novamente', detail: 'Houve um erro inesperado, tente novamente', life: 3000 });
            setLoading(false);
        }

    }

    return (
        <Dialog style={{maxWidth: 850}} header="Cadastrar venda" visible={open} modal onHide={loading ? null : close}>
            <Toast ref={toast} />
            <form onSubmit={handleCadastrarVenda}>
                <div className="grid pt-4">
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-box" />
                            <InputText value={nomeProduto} onChange={e => setNomeProduto(e.target.value)} required type="text" className="w-full" placeholder="Produto" />
                            <label htmlFor="username">Produto</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-calendar" />
                            <Calendar dateFormat="dd/mm/yy" for value={dataVenda} onChange={e => {
                                setDataVenda(e.value);
                                setErrorDataVenda(false);
                            }} locale="pt_BR" id="calendar" placeholder="Data da venda" className={errorDataVenda ? 'w-full p-invalid' : 'w-full'} ></Calendar>
                            <label htmlFor="calendar">Data da venda</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-user" />
                            <InputText value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} required type="text" className="w-full" placeholder="Nome do cliente" />
                            <label htmlFor="username">Nome do cliente</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-at" />
                            <InputText value={emailCliente} onChange={e => setEmailCliente(e.target.value)} required type="email" className="w-full" placeholder="E-mail do cliente" />
                            <label htmlFor="username">E-mail do cliente</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-id-card" />
                            <InputMask
                                mask="999.999.999-99"
                                onChange={e => {
                                    setCpfCliente(e.target.value);
                                    setErrorCPF(false);
                                }}
                                value={cpfCliente}
                                required
                            >
                                { e => <InputText id="cpf_cliente" required type="text" className={errorCPF ? 'w-full p-invalid' : 'w-full'} placeholder="CPF do cliente" /> }
                            </InputMask>
                            <label className="active" htmlFor="cpf_cliente">CPF do cliente</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map-marker" />
                            <InputText value={enderecoCliente} onChange={e => setEnderecoCliente(e.target.value)} required type="text" className="w-full" placeholder="Endereço do cliente" />
                            <label htmlFor="username">Endereço do cliente</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map-marker" />
                            <InputText value={numeroCliente} onChange={e => setNumeroCliente(e.target.value)} required type="text" className="w-full" placeholder="Número ou SN" />
                            <label htmlFor="numero_cliente">Número</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map-marker" />
                            <InputText value={complemento} onChange={e => setComplemento(e.target.value)} required type="text" className="w-full" placeholder="Complemento" />
                            <label htmlFor="username">Complemento</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map" />
                            <InputText value={bairro} onChange={e => setBairro(e.target.value)} required type="text" className="w-full" placeholder="Bairro" />
                            <label htmlFor="username">Bairro</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map" />
                            <InputText value={cidade} onChange={e => setCidade(e.target.value)} required type="text" className="w-full" placeholder="Cidade" />
                            <label htmlFor="username">Cidade</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map" />
                            <InputText value={estado} onChange={e => setEstado(e.target.value)} required type="text" className="w-full" placeholder="Estado" />
                            <label htmlFor="username">Estado</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-map" />
                            <InputMask
                                mask="99999-999"
                                onChange={e => {
                                    setCepVenda(e.target.value);
                                    setErrorCEP(false);
                                }}
                                value={cepVenda}
                            >
                                { e => <InputText id="cep_venda" required type="text" className={errorCEP ? 'w-full p-invalid' : 'w-full'} placeholder="CEP" /> }
                            </InputMask>
                            <label htmlFor="cep_venda">CEP</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-dollar" />
                            <InputText value={valorVenda} onChange={e => {
                                handleMascararReal(e, setValorVenda);
                                setErrorValorVenda(false);
                            }} required type="text" className={errorValorVenda ? 'w-full p-invalid' : 'w-full'} placeholder="Valor da venda" />
                            <label htmlFor="username">Valor da venda</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-dollar" />
                            <InputText value={valorIntermediacao} onChange={e => {
                                handleMascararReal(e, setValorIntermediacao);
                                setErrorValorIntermediacao(false);
                            }} required type="text" className={errorValorIntermediacao ? 'w-full p-invalid' : 'w-full'} placeholder="Valor da intermediação" />
                            <label htmlFor="username">Valor da intermediação</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-wallet" />
                            <InputText value={numeroParcelas} onChange={e => setNumeroParcelas(e.target.value)} required type="number" min="1" className="w-full" placeholder="Número de parcelas" />
                            <label htmlFor="username">Número de parcelas</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-clone" />
                            <InputText value={numeroContrato} onChange={e => setNumeroContrato(e.target.value)} required type="number" min="0" className="w-full" placeholder="Número do contrato" />
                            <label htmlFor="username">Número de contrato</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <Button loading={loading} icon="pi pi-save" className="p-button-info" label="Cadastrar venda" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
}

export default CadastrarVenda;
