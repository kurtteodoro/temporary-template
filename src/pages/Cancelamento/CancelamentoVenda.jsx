import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { Skeleton } from 'primereact/skeleton';
import CancelamentoVendasService from "../../service/CancelamentoVendaService";

const CancelamentoVenda = function() {
  const cancelamentoService = new CancelamentoVendasService();
  const [treeTableNodes, setTreeTableNodes] = useState([]);
  const [selectedTreeTableNodeKeys, setSelectedTreeTableNodeKeys] = useState([]);
  const [extratoVendas, setExtratoVendas] = useState([]);
  const fazerExtrato = useRef(false);
  const [searching, setSearching] =  useState(false)  
  const toast = useRef(null);

  useEffect(() => {
    if (fazerExtrato.current) {      
      let treeExtrato = cancelamentoService.toTreeExtrato(extratoVendas);
      setTreeTableNodes(treeExtrato);
      fazerExtrato.current = false;
    }
  }, [extratoVendas]);

  const cancelarExtrato = () => {
    console.log(`valores para cancelar ${selectedTreeTableNodeKeys} `);
    cancelamentoService.enviarRemessaCancelamento(selectedTreeTableNodeKeys)
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
            setExtratoVendas(resp.data);
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
            <Button label="Pesquisar" className="p-button-secondary mr-2 mb-2" onClick={obterExtrato} />                    
            <Button label="Cancelar" className="p-button-danger mr-2 mb-2" onClick={cancelarExtrato} />
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
              <Column field="status" header="Status" />
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