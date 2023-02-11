import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';

export const Error = (props) => {
    const navigate = useNavigate();

    const goDashboard = () => {
        navigate('/');
    };

    return (
        <div className="exception-body error">
            <div className="exception-panel">
                <h1>ERROR</h1>
                <h3>something's went wrong</h3>
                <Button type="button" label="Go back to home" onClick={goDashboard}></Button>
            </div>
            <div className="exception-footer">
                <img src={`assets/layout/images/logo-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} className="exception-logo" alt="exception-logo" />
                <img src={`assets/layout/images/appname-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} className="exception-appname" alt="exception-appname" />
            </div>
        </div>
    );
};
