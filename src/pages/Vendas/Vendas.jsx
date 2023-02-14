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

const Vendas = function() {

    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialogCadastrarVenda, setOpenDialogCadastrarVenda] = useState(false);
    const [parcelasVendaSelecionada, setParcelasVendaSelecionada] = useState({});
    const [openDialogParcelas, setOpenDialogParcelas] = useState(false);
    const [vendaAberta, setVendaAberta] = useState({});
    const toast = useRef();

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

    const formataVenda = function(v) {
        var obj = JSON.parse(v.conteudo);
        obj.acoes = (<div>
            <Button icon="pi pi-pencil" className="mr-2" />
            <Button icon="pi pi-trash" className="p-button-danger mr-2" />
            <Button icon="pi pi-check" className="p-button-success" />
        </div>);
        obj.qtdParcelas = obj.numeroDeParcelas;
        obj.numeroDeParcelas = (<Button onClick={() => handleAbrirModalParcelas(obj)}>{obj?.parcelas?.length ?? 0} parcelas</Button>);
        obj.dataVenda = obj.dataVenda.replace(/-/g, '/');
        obj.dataCriacaoVenda = obj.dataCriacaoVenda.replace(/-/g, '/');
        obj.id = v.Id;
        return obj;
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

    return (
        <div>
            <Toast ref={toast} />
            <TabView>
                <TabPanel header={< div className='ml-2'>Vendas</div>} leftIcon="pi pi-shopping-cart">
                    <div className="flex justify-content-end">
                        <Button onClick={() => setOpenDialogCadastrarVenda(true)} loading={loading} className="p-button-success mt-2" label="Cadastrar venda" icon="pi pi-plus" />
                        <CadastrarVenda close={fecharModalVenda} open={openDialogCadastrarVenda} />
                        <Parcelas refresh={start} vendaAberta={vendaAberta} parcelas={parcelasVendaSelecionada} close={fecharModalParcelas} open={openDialogParcelas} />
                    </div>

                    <div className="mt-3 card">
                        {
                            loading ?
                                (
                                    <Skeleton height={300} />
                                )
                            :
                                (
                                    <DataTable value={vendas} responsiveLayout="scroll" emptyMessage="Nenhuma venda encontrada" dataKey="id">
                                        <Column className="white-space-nowrap" field="codigo" header="Código" />
                                        <Column className="white-space-nowrap" field="nomeCliente" header="Cliente" />
                                        <Column className="white-space-nowrap" field="unidade" header="Produto" />
                                        <Column className="white-space-nowrap" field="dataVenda" header="Data de venda" />
                                        <Column className="white-space-nowrap" field="dataCriacaoVenda" header="Cadastrado em" />
                                        <Column className="white-space-nowrap" field="emailCliente" header="E-mail" />
                                        <Column className="white-space-nowrap" field="valorDaVenda" header="Valor da venda" />
                                        <Column className="white-space-nowrap" field="valor" header="Valor da intermediação" />
                                        <Column className="white-space-nowrap" field="numeroContrato" header="Nº Contrato" />
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
