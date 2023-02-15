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

    const aprovarVenda = async function(venda) {
        var somaParcelas = 0;

        venda?.parcelas?.forEach(p => {
            somaParcelas += brlToFloat(p.valor);
            var somaRateio = 0;
            p?.rateio?.forEach(r => {
                somaRateio += brlToFloat(r.valor);
            });

            var diffRateio = parseInt(somaRateio) - parseInt(brlToFloat(p.valor));
            if(diffRateio < -5 || diffRateio > 5) {
                toast.current.show({ severity: 'error', summary: 'Verique', detail: 'A soma dos rateios deve ser o valor da parcela', life: 3000 });
                console.log(diffRateio);
                return;
            }

        });

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
                return (<span className="product-badge status-instock">Preenchimento</span>)
                break;
            case 1:
                return (<span className="product-badge status-instock">Venda</span>)
                break;
            case 2:
                return (<span className="product-badge status-instock">Remessa</span>)
                break;
        }
    }

    const formataVenda = function(v) {
        var obj = JSON.parse(v.conteudo);
        obj.acoes = (<div>
            <Button icon="pi pi-pencil" onClick={() => abrirModalEditarVenda(obj)} className="mr-2" />
            {/*<Button icon="pi pi-trash" onClick={() => abrirModalConfirmarExclusaoVenda(obj)} className="p-button-danger mr-2" />*/}
            <Button disabled={obj.status != 0} icon="pi pi-check" onClick={() => aprovarVenda(obj)} className="p-button-success" />
        </div>);
        obj.qtdParcelas = obj.numeroDeParcelas;
        obj.numeroDeParcelas = (<Button onClick={() => handleAbrirModalParcelas(obj)}>{obj?.parcelas?.length ?? 0} parcelas</Button>);
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
           else
               toast.current.show({ severity: 'error', summary: 'Ops', detail: 'Apenas vendas com status "VENDA" pode ir para remessa', life: 3000 })
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
                <Button type="button" label="Não" icon="pi pi-times" onClick={() => setOpenDialogExclusaoVenda(false)} className="p-button-text" />
                <Button type="button" label="Sim" icon="pi pi-check" onClick={ handleDeletarVenda } className="p-button-text" autoFocus />
            </>
        );
    }


    return (
        <div>
            <Toast ref={toast} />
            <TabView>
                <TabPanel header={< div className='ml-2'>Vendas</div>} leftIcon="pi pi-shopping-cart">
                    <div className="flex justify-content-end">
                        <div className="mr-2">
                            <Button disabled={vendasSelecionadaRemessa.length == 0} loading={loading} className="p-button-info mt-2" label="Enviar remessa" icon="pi pi-send" />
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
                                        <Column className="white-space-nowrap" field="numeroContrato" header="Nº Contrato" />
                                        <Column className="white-space-nowrap" field="status_table" header="Status" />
                                        <Column className="white-space-nowrap" field="numeroDeParcelas" header="Parcelas" />
                                        <Column className="white-space-nowrap" field="acoes" header="Ações" />
                                    </DataTable>
                                )
                        }
                    </div>

                </TabPanel>
                <TabPanel header={< div className='ml-2'>Remessas</div>} leftIcon="pi pi-shopping-bag">
                    <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </p>
                </TabPanel>
            </TabView>
        </div>
    )
}

export default Vendas;
