import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export const NotFound = (props) => {
    const navigate = useNavigate();

    const goDashboard = () => {
        navigate('/');
    };

    return (
        <div className="exception-body notfound" style={{ background: 'none'}}>
            <div className="exception-panel">
                <h1>404</h1>
                <h3>Não encontrado</h3>
                <p>A página que você está procurando não existe</p>

                <Button type="button" label="Voltar a página inicial" onClick={goDashboard}></Button>
            </div>
            <div className="exception-footer">
                <img src={`assets/images/removebg.png`} className="exception-logo" alt="Empresa banking" />
                <img src={`assets/images/logo-maxtool.svg`} className="exception-appname" alt="Empresa construtora do software" />
            </div>
        </div>
    );
};
