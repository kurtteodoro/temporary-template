import {Dialog} from "primereact/dialog";
import {Toast} from "primereact/toast";
import {Calendar} from "primereact/calendar";
import {InputText} from "primereact/inputtext";
import {handleMascararReal} from "../../components/utils/FormatacaoReal";
import {Button} from "primereact/button";
import React, {useRef, useState} from "react";

const CadastrarRateio = function({ open, close, parcela }) {

    const toast = useRef();
    const [nomeBeneficiado, setNomeBeneficiado] = useState('');
    const [CPFBeneficiado, setCPFBeneficiado] = useState('');
    const [valorRateio, setValorRateio] = useState('');

    const handleCadastrarRateio = function() {

    }

    const handleFecharModal = function() {
        close();
    }

    return (
        <Dialog header={"Cadastrar rateio da parcela #" + parcela?.id} visible={open} onHide={handleFecharModal}>
            <form onSubmit={handleCadastrarRateio}>
                <Toast ref={toast} />
                <div className="grid pt-4">
                    <div className="col-12 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-user" />
                            <InputText value={nomeBeneficiado} required type="text" className="w-full" placeholder="Nome do beneficiado" />
                            <label htmlFor="calendar">Nome do beneficiado</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-id-card" />
                            <InputText value={CPFBeneficiado} required className="w-full" placeholder="CPF/CNPJ do beneficiado" />
                            <label htmlFor="calendar">CPF/CNPJ do beneficiado</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <span className="p-input-icon-right block p-float-label">
                            <i className="pi pi-dollar" />
                            <InputText value={valorRateio} required className="w-full" placeholder="Valor do rateio R$" />
                            <label htmlFor="calendar">Valor do rateio R$</label>
                        </span>
                    </div>
                    <div className="col-6 mb-3">
                        <Button className="p-button-info" icon="pi pi-save" label="Cadastrar rateio" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
}

export default CadastrarRateio;
