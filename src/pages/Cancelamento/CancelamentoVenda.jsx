import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import CancelamentoVendasService from "../../service/CancelamentoVendaService";
import CancelamentoVendasHelper from "../../helpers/CancelamentoVendaHelper";
import { Dialog } from 'primereact/dialog';

const CancelamentoVenda = function() {
  const cancelamentoService = new CancelamentoVendasService()
  const cancelamentoHelper = new CancelamentoVendasHelper()
  const [treeTableNodes, setTreeTableNodes] = useState([]);
  const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] = useState([]);
  const [extratoVendas, setExtratoVendas] = useState([]);
  const fazerExtrato = useRef(false);
  const [searching, setSearching] =  useState(false)  
  const toast = useRef(null);  
  const [dialogConfirmacaoExclusao, setDialogConfirmacaoExclusao] = useState(false);
  
  const footerConfirmacaoExclusao = (
    <>
        <Button type="button" label="Não" icon="pi pi-times" onClick={() => setDialogConfirmacaoExclusao(false)} className="p-button-text" />
        <Button type="button" label="Sim" icon="pi pi-check" onClick={() => {setDialogConfirmacaoExclusao(false); aceitoCancelamentoVenda()}} className="p-button-text" autoFocus />
    </>
);

const aceitoCancelamentoVenda = () => {
  
  try{
      const data =  cancelamentoHelper.toDTOCancelamentoVenda(selectedTreeTableNodeKeys);
      cancelamentoService.callCancelamentoVenda(data)        
      toast.current.show({ severity: 'success', summary: 'Atenção', detail: 'Solicitação realizada com sucesso', life: 3000 });
      setTreeTableNodes(null)
      setSelectedTreeTableNodeKeys(null)
  }catch(ex){
    console.log(ex)
    switch (ex?.response?.status) {     
      case 401:
          toast.current.show({ severity: 'error', summary: 'Permissão', detail: 'Verifique suas permissões com administrador', life: 3000 });
          break;
      default:
          toast.current.show({ severity: 'error', summary: 'Tente novamente', detail: 'Houve um erro inesperado, tente novamente', life: 3000 });
          break;
  }
    
  }
}

  useEffect(() => {
    if (fazerExtrato.current) {      
      let treeExtrato =  cancelamentoHelper.toTreeExtrato(extratoVendas);
      setTreeTableNodes(treeExtrato);
      fazerExtrato.current = false;
    }
  }, [extratoVendas]);

  const cancelarExtrato = () => {    
    if (Array.isArray(selectedTreeTableNodeKeys)){
      if (!selectedTreeTableNodeKeys.length){
        toast.current.show({
          severity: 'warn',
          summary: 'Atenção',
          detail: 'Por favor selecione uma venda',
          life: 3000
        });
        return;
      }  
    }

    if (!selectedTreeTableNodeKeys) {      
      toast.current.show({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Por favor selecione uma venda',
        life: 3000
      });
      return;
    
    }  
    setDialogConfirmacaoExclusao(true)
  };

  const statusBodyTemplate = (rowData) => {    
    return (
        <> 
            <span className="product-badge status-instock">{rowData.data.status}</span>
        </>
    );
};

  const obterExtrato = () => {
    setSearching(true)
    setSelectedTreeTableNodeKeys(null)
    cancelamentoService
      .callExtratoVendas()
      .then(resp => {
        if (resp.data) {
          if (!fazerExtrato.current) {
            fazerExtrato.current = true;            
            setExtratoVendas( cancelamentoHelper.obterVendasComStatusRegistrada( resp.data));            
            setSearching(false)
          }
        }
      })
      .catch(e => {
        toast.current.show({ severity: 'error', summary: 'Error', detail: e.message, life: 3000 });
        console.log(e);
      });    
  };

  const ToolBarSearch = () => {
    return (
      <div >
            <Button label="Pesquisar" className="mr-2 mb-2" onClick={obterExtrato} />                                
            <Button label="Cancelar" className="p-button-danger mr-2 mb-2" onClick={cancelarExtrato} />            
            <Dialog header="Confirmation" visible={dialogConfirmacaoExclusao} onHide={() => setDialogConfirmacaoExclusao(false)} style={{ width: '350px' }}
             modal footer={footerConfirmacaoExclusao}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                <span>Deseja realmente cancelar as vendas selecionadas?</span>
                            </div>
                        </Dialog>
      </div>
    );
  };

  return (
    <>
      <Toolbar className="p-mb-4 p-toolbar" right={ToolBarSearch}></Toolbar>
      <br />
      <div className="grid">
        <div className="col-12">
          <div className="card">
          <Toast ref={toast} />
            <h5>Vendas</h5>
        { !searching &&
            <TreeTable
              value={treeTableNodes}
              header="Vendas disponíveis"
              selectionMode="checkbox"
              selectionKeys={selectedTreeTableNodeKeys}
              onSelectionChange={e => setSelectedTreeTableNodeKeys(e.value)}              
            >
              <Column field="descricao" header="Unidade" expander />
              <Column field="data" header="Data" />
              <Column field="valor" header="Valor" />
              <Column field="status" header="Status" body={statusBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}   />
            </TreeTable>
        }
        {                
                searching &&
                 <div className="custom-skeleton p-p-4">                      
                    <Skeleton width="100%" height="150px"></Skeleton>                       
                </div>   
        }
          </div>
        </div>
      </div>
    </>
  );
};

export default CancelamentoVenda;