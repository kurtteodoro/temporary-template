import {Toast} from "primereact/toast";
import React, {useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {primeiraLetraMaiusulo} from "../../components/utils/FormatacaoString";
import {Button} from "primereact/button";
import {TabPanel, TabView} from "primereact/tabview";
import {InputText} from "primereact/inputtext";
import {Calendar} from "primereact/calendar";
import InputMask from "react-input-mask";
import {handleMascararReal} from "../../components/utils/FormatacaoReal";
import CadastrarParcela from "./CadastrarParcela";
import VendaServiceAPI from "../../service/VendaServiceAPI";
import {copiarVendaParaJSON} from "../../components/utils/Venda";

const Parcelas = function({ open, close, parcelas, vendaAberta, refresh }) {

    const toast = useRef();
    const [expandedRows, setExpandedRows] = useState(null);
    const [openDialogDeletarParcela, setOpenDialogDeletarParcela] = useState(false);
    const [parcelaDeletar, setParcelaDeletar] = useState();
    const [loading, setLoading] = useState(false);
    const [abaSelecionada, setAbaSelecionada] = useState(0);
    const [parcelaEditando, setParcelaEditando] = useState();
    const formatarParcela = function() {

        const funcDeletarParcela = function(p) {
            setOpenDialogDeletarParcela(true);
            setParcelaDeletar(p.id);
        }

        const editarParcela = function(parcela) {
            setAbaSelecionada(1);
            setParcelaEditando(parcela);
        }

        if(parcelas == null || ( typeof parcelas == "object" && !Array.isArray(parcelas) && Object.keys(parcelas) == 0 ) )
            return [];

        var __parcelas = [...parcelas];
        __parcelas.forEach(p => {
           p.formaPgto = primeiraLetraMaiusulo(p.formaPgto)
           p.dataVencimento = p.dataVencimento.replace(/-/g, '/');
           p.acoes = (
               <div>
                   <Button icon="pi pi-pencil" onClick={() => editarParcela(p)} className="mr-2" />
                   <Button icon="pi pi-trash" onClick={() => funcDeletarParcela(p)} className="p-button-danger" />
               </div>
           )
        });

        return __parcelas;
    }

    const rowRateio = (data) => {
        return (
            <div className="orders-subtable">
                <h6>Rateios da parcela #{data.id}</h6>
                <DataTable value={data.rateio} responsiveLayout="scroll" emptyMessage={<div className="mt-2">Nenhum rateio encontrado</div>}>
                    <Column field="id" header="Id" ></Column>
                    <Column field="beneficiado" header="Beneficiado"></Column>
                    <Column field="valor" header="Valor"></Column>
                    <Column field="DOC" header="CPF/CNPJ do beneficiado"></Column>
                </DataTable>
            </div>
        );
    };

    const handleDeletarParcela = async function() {
        setOpenDialogDeletarParcela(false);
        setLoading(true);
        const vendaServiceAPI = new VendaServiceAPI();
        var vendaAtualizada = copiarVendaParaJSON(vendaAberta);

        vendaAtualizada.parcelas.forEach((p, i) => {
            if(p.id == parcelaDeletar)
                vendaAtualizada.parcelas.splice(i, 1);
        });

        try{
            const res = await vendaServiceAPI.atualizarVenda(vendaAtualizada, vendaAberta.id);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Parcela excluída com sucesso', life: 3000 });
        } catch(ex) {
            toast.current.show({ severity: 'error', summary: 'Erro desconhecido', detail: 'Ops, houve um erro desconhecido, tente novamente', life: 3000 });
        }

        await refresh();
        setLoading(false);
    }

    const dialogDeletarParcela = (
        <>
            <Button type="button" label="Não" icon="pi pi-times" onClick={() => setOpenDialogDeletarParcela(false)} className="p-button-text" />
            <Button type="button" label="Sim" icon="pi pi-check" onClick={handleDeletarParcela} className="p-button-text" autoFocus />
        </>
    );

    const handleTabAlterada = function(e) {
        setAbaSelecionada(e.index);
        if(e.index != 1)
            setParcelaEditando(null);
    }

    const fecharModal = function() {
        setParcelaEditando(null);
        setAbaSelecionada(0);
        close();
    }

    return (
        <Dialog visible={open} header="Parcelas da venda" onHide={fecharModal}>
            <Toast ref={toast} />
            <Dialog header="Deletar parcela ?" onHide={() => setOpenDialogDeletarParcela(false)} visible={openDialogDeletarParcela} footer={dialogDeletarParcela}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    <span>Tem certeza que deseja deletar essa parcela ?</span>
                </div>
            </Dialog>
            <TabView activeIndex={abaSelecionada} onTabChange={handleTabAlterada}>
                <TabPanel leftIcon="pi pi-th-large" header={< div className='ml-2'>Parcelas cadastradas</div>}>
                    <div className="card">
                        <DataTable loading={loading} rowExpansionTemplate={rowRateio} expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)} value={formatarParcela(parcelas)} responsiveLayout="scroll" emptyMessage={<div className="mt-2">Nenhuma parcela encontrada</div>} dataKey="id">
                            <Column header="Rateios" expander style={{ width: '3em' }} />
                            <Column className="white-space-nowrap" field="id" header="ID" />
                            <Column className="white-space-nowrap" field="dataVencimento" header="Data de vencimento" />
                            <Column className="white-space-nowrap" field="valor" header="Valor" />
                            <Column className="white-space-nowrap" field="formaPgto" header="Forma de pagamento" />
                            <Column className="white-space-nowrap" field="acoes" header="Ações" />
                        </DataTable>
                    </div>
                </TabPanel>
                <TabPanel header={< div className='ml-2'>{ parcelaEditando ? 'Editar parcela' : 'Cadastrar parcelas' }</div>} leftIcon="pi pi-save">
                    <CadastrarParcela voltar={ () => {
                        setAbaSelecionada(0);
                        setParcelaEditando(null);
                    }} parcelaEditando={parcelaEditando} refresh={refresh} venda={vendaAberta} />
                </TabPanel>
            </TabView>
        </Dialog>
    );
}

export default Parcelas;
