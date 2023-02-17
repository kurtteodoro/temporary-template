import React, {useEffect, useRef, useState} from "react";
import {TabPanel, TabView} from "primereact/tabview";
import {Button} from "primereact/button";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {Skeleton} from "primereact/skeleton";
import VendaServiceAPI from "../../service/VendaServiceAPI";
import {Toast} from "primereact/toast";
import CadastrarVenda from "./CadastrarVenda";
import Parcelas from "./Parcelas";
import {Dialog} from "primereact/dialog";
import {brlToFloat} from "../../components/utils/FormatacaoReal";
import {copiarVendaParaJSON} from "../../components/utils/Venda";
import {Checkbox} from "primereact/checkbox";

import {copiarVendaParaJSONRemessa} from "../../components/utils/Remessa";

import hasRole from "../../utilities/AuthorizationButtons";


const Vendas = function() {

    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialogCadastrarVenda, setOpenDialogCadastrarVenda] = useState(false);
    const [parcelasVendaSelecionada, setParcelasVendaSelecionada] = useState({});
    const [openDialogParcelas, setOpenDialogParcelas] = useState(false);
    const [vendaAberta, setVendaAberta] = useState({});
    const toast = useRef();
    const [vendaEditando, setVendaEditando] = useState();
    const [openDialogExclusaoVenda, setOpenDialogExclusaoVenda] = useState(false);
    const [vendaExcluindo, setVendaExcluindo] = useState();
    const [vendasSelecionadaRemessa, setVendasSelecionadaRemessa] = useState([]);
    const [openDialogAprovarVenda, setOpenDialogAprovarVenda] = useState(false);
    const [vendaAprovando, setVendaAprovando] = useState();

    useEffect(() => {
        start();
    }, []);

    const start = async function() {
        const vendaServiceAPI = new VendaServiceAPI();

        try{
            const result = await vendaServiceAPI.buscarVendas();
            setVendas(formatarVendas(result.data));
            setLoading(false);

            // Se o usuário estiver com o modal de alguma venda aberto
            if(vendaAberta && Object.keys(vendaAberta).length > 0) {
                const tmp = {
                    ...JSON.parse(result.data.find(e => e.Id == vendaAberta.id).conteudo),
                    id: vendaAberta.id
                }
                setVendaAberta(tmp);
                setParcelasVendaSelecionada(tmp.parcelas);
            }
        } catch(ex) {
            toast.current.show({ severity: 'error', summary: 'Erro desconhecido', detail: 'Ops, houve um erro desconhecido, tente novamente', life: 3000 });
        }
    }

    const formatarVendas = function(data) {
        var vendasExibicao = [];

        if(data.length == 0)
            return vendasExibicao;

        data.forEach( v => {
            vendasExibicao.push(
                formataVenda(v)
            );
        });

        return vendasExibicao.reverse();
    }

    const handleAbrirModalParcelas = function(venda) {
        setParcelasVendaSelecionada(venda.parcelas);
        setVendaAberta(venda);
        setOpenDialogParcelas(true);
    }

    const abrirModalEditarVenda = function(venda) {
        setVendaEditando(venda);
        setOpenDialogCadastrarVenda(true);
    }

    const abrirModalConfirmarExclusaoVenda = function(venda) {
        setOpenDialogExclusaoVenda(true);
        setVendaExcluindo(venda);
    }

    const abrirModalAprovarVenda = function (venda) {
        setOpenDialogAprovarVenda(true);
        setVendaAprovando(venda);
    }

    const aprovarVenda = async function() {
        setOpenDialogAprovarVenda(false);
        var venda = {...vendaAprovando};
        var somaParcelas = 0;
        var exit = false;
        venda?.parcelas?.forEach(p => {
            somaParcelas += brlToFloat(p.valor);
            var somaRateio = 0;
            p?.rateio?.forEach(r => {
                somaRateio += brlToFloat(r.valor);
            });

            var diffRateio = parseInt(somaRateio) - parseInt(brlToFloat(p.valor));
            if(diffRateio < -5 || diffRateio > 5) {
                toast.current.show({ severity: 'error', summary: 'Verique', detail: 'A soma dos rateios deve ser o valor da parcela', life: 3000 });
                exit = true;
                return 0;
            }

        });

        if(exit)
            return 0;

        var diffParcelas = parseInt(somaParcelas) - parseInt(brlToFloat(venda.valor));
        if(diffParcelas < -5 || diffParcelas > 5) {
            toast.current.show({ severity: 'error', summary: 'Verique', detail: 'A soma das parcelas deve ser o valor da intermediação', life: 3000 });
            return;
        }

        try {
            setLoading(true);
            const vendaServiceAPI = new VendaServiceAPI();
            venda.status = 1;
            var res = await vendaServiceAPI.atualizarVenda(copiarVendaParaJSON(venda),venda.id);
            start();
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Venda aprovada com sucesso', life: 3000 });
        } catch (ex) {
            toast.current.show({ severity: 'error', summary: 'Tente novamente', detail: 'Houve um erro inesperado, tente novamente', life: 3000 });
            setLoading(false);
        }

    }

    const gerarStatus = function(status=0) {
        switch (status) {
            case 0:
                return (<span className="customer-badge preenchimento-venda">Preenchimento</span>)
                break;
            case 1:
                return (<span className="product-badge status-instock">Venda</span>)
                break;
            case 2:
                return (<span className="customer-badge status-unqualified">Remessa</span>)
                break;
        }
    }

    const formataVenda = function(v) {
        var obj = JSON.parse(v.conteudo);
        obj.acoes = (<div>
            <Button disabled={obj.status == 2} icon="pi pi-pencil" onClick={() => abrirModalEditarVenda(obj)} className="mr-2" tooltip="Editar Venda" />
            {/*<Button icon="pi pi-trash" onClick={() => abrirModalConfirmarExclusaoVenda(obj)} className="p-button-danger mr-2" />*/}

            <Button disabled={obj.status != 0} icon="pi pi-chevron-right" onClick={() => abrirModalAprovarVenda(obj)} className="p-button-warning" />

         { 
         /*  <Button disabled={obj.status != 0} icon="pi pi-chevron-right" onClick={() => aprovarVenda(obj)} className="p-button-warning" tooltip="Aprovar Venda" /> */
    }

        </div>);
        obj.qtdParcelas = obj.numeroDeParcelas;
        obj.numeroDeParcelas = (<Button className="p-button-secondary" onClick={() => handleAbrirModalParcelas(obj)}>  
        
        
         {obj?.parcelas?.length ?? 0} parcelas</Button>);
        obj.dataVenda = obj.dataVenda.replace(/-/g, '/');
        obj.dataCriacaoVenda = obj.dataCriacaoVenda.replace(/-/g, '/');
        obj.id = v.Id;
        obj.status_table = gerarStatus(obj?.status);
        return obj;
    }

    const handleChangeCheckVenda = function(vendas) {
        var toAdd = [];
        vendas?.forEach((v,i) => {
           if(v.status == 1)
               toAdd.push(v);
        });
        setVendasSelecionadaRemessa(toAdd);
    }

    const fecharModalVenda = function(venda=null) {
        setOpenDialogCadastrarVenda(false);
        if(venda) {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Venda cadastrada com sucesso', life: 3000 });
            start();
        }
    }

    const fecharModalParcelas = function(venda=null) {
        setOpenDialogParcelas(false);
    }

    const handleDeletarVenda = async function() {
        setLoading(true);
        setOpenDialogExclusaoVenda(false);
        const vendaServiceAPI = new VendaServiceAPI();

        try {
            const res = await vendaServiceAPI.excluirVenda(vendaExcluindo.id);
        } catch(ex) {
            toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Houve um erro inesperado, tente novamente', life: 3000 });
        }

        await start();
    }

    const footerModalExcluirVenda = function() {
        return (
            <>
                <Button type="button" label="Não" icon="pi pi-times" onClick={() => setOpenDialogExclusaoVenda(false)} className="p-button-text"  />
                <Button type="button" label="Sim" icon="pi pi-check" onClick={ handleDeletarVenda } className="p-button-text" autoFocus />
            </>
        );
    }

    const footerModalAprovarVenda = function() {
        return (
            <>
                <Button type="button" label="Não" icon="pi pi-times" onClick={() => setOpenDialogAprovarVenda(false)} className="p-button-text" />
                <Button type="button" label="Sim" icon="pi pi-check" onClick={ aprovarVenda } className="p-button-text" autoFocus />
            </>
        );
    }

    const handleGerarRemessa = async function() {
        if(vendasSelecionadaRemessa.length > 0) {
            var vendasGerarRemessas = [];
            vendasSelecionadaRemessa?.forEach(v => {
                vendasGerarRemessas.push({
                    venda: {...copiarVendaParaJSONRemessa(v, v.id)}
                });
            });
            console.log(JSON.stringify(vendasGerarRemessas));            
            const vendaServiceAPI = new VendaServiceAPI();
            try {
                setLoading(true);
                const res = await vendaServiceAPI.gerarRemessas(vendasGerarRemessas);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Remessas geradas com sucesso', life: 3000 });
                for (const v of vendasSelecionadaRemessa) {
                    await vendaServiceAPI.atualizarVenda({
                        ...vendasSelecionadaRemessa.find(e => e.id == v.id),
                        status: 2
                    }, v.id)
                }
            } catch(ex) {
                toast.current.show({ severity: 'error', summary: 'Erro', detail: 'Houve um erro inesperado, tente novamente', life: 3000 });
            }
            await start();
        }
    }

    return (
        <div>
            <Toast ref={toast} />
            <TabView>
                <TabPanel header={< div className='ml-2'>Vendas</div>} leftIcon="pi pi-shopping-cart">
                    <div className="flex justify-content-end">
                        <div className="mr-2">{
                          hasRole('ROLE_ENVIAR_REMESSA') &&
                            <Button onClick={handleGerarRemessa} disabled={vendasSelecionadaRemessa.length == 0} loading={loading} className="p-button-info mt-2" label="Enviar remessa" icon="pi pi-send" tooltip="Enviar Remessa" />
                        }
                        </div>
                        <Button onClick={() => {
                            setOpenDialogCadastrarVenda(true);
                            setVendaEditando(null);
                        }} loading={loading} className="p-button-success mt-2" label="Cadastrar venda" icon="pi pi-plus" />
                        <CadastrarVenda close={fecharModalVenda} open={openDialogCadastrarVenda} vendaEditando={vendaEditando} />
                        <Parcelas refresh={start} vendaAberta={vendaAberta} parcelas={parcelasVendaSelecionada} close={fecharModalParcelas} open={openDialogParcelas} />
                        <Dialog header="Excluir venda" visible={openDialogExclusaoVenda} footer={footerModalExcluirVenda()}>
                            <p>Realmente deseja excluir a venda #{vendaExcluindo?.codigo} ?</p>
                        </Dialog>
                        <Dialog header="Aprovar venda" visible={openDialogAprovarVenda} footer={footerModalAprovarVenda()}>
                            <p>Realmente deseja aprovar a venda #{vendaAprovando?.codigo} ?</p>
                        </Dialog>
                    </div>

                    <div className="mt-3 card">
                        {
                            loading ?
                                (
                                    <Skeleton height={300} />
                                )
                            :
                                (
                                    <DataTable value={vendas} selection={vendasSelecionadaRemessa} onSelectionChange={e => handleChangeCheckVenda(e.value)} responsiveLayout="scroll" emptyMessage="Nenhuma venda encontrada" dataKey="id">
                                        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                        <Column className="white-space-nowrap" field="codigo" header="Código" />
                                        <Column className="white-space-nowrap" field="nomeCliente" header="Cliente" />
                                        <Column className="white-space-nowrap" field="unidade" header="Produto" />
                                        <Column className="white-space-nowrap" field="dataVenda" header="Data de venda" />
                                        <Column className="white-space-nowrap" field="dataCriacaoVenda" header="Cadastrado em" />
                                        <Column className="white-space-nowrap" field="emailCliente" header="E-mail" />
                                        <Column className="white-space-nowrap" field="valorDaVenda" header="Valor da venda" />
                                        <Column className="white-space-nowrap" field="valor" header="Valor da intermediação" />                                        
                                        <Column className="white-space-nowrap" field="status_table" header="Status" />
                                        <Column className="white-space-nowrap" field="numeroDeParcelas" header="Parcelas" />
                                        <Column className="white-space-nowrap" field="acoes" header="Ações" />
                                    </DataTable>
                                )
                        }
                    </div>

                </TabPanel>
            </TabView>
        </div>
    )
}

export default Vendas;
