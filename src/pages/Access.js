import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export const Access = (props) => {
    const navigate = useNavigate();

    const goDashboard = () => {
        navigate('/');
    };

    return (
        <div className="exception-body accessdenied">
            <div className="exception-panel">
                <h1>ACESSO</h1>
                <h3>NEGADO</h3>
                <p>Você não tem permissão para acessar essa página</p>
                <Button type="button" label="Voltar a página inicial" onClick={goDashboard}></Button>
            </div>
            <div className="exception-footer">
                <img src={`assets/images/removebg.png`} className="exception-logo" alt="Empresa banking" />
                <img src={`assets/images/logo-maxtool.svg`} className="exception-appname" alt="Empresa construtora do software" />
            </div>
        </div>
    );
};
