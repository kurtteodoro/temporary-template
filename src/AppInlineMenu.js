import React, {useEffect, useRef, useState} from 'react';
import { CSSTransition } from 'react-transition-group';
import { classNames } from 'primereact/utils';

const AppInlineMenu = (props) => {
    const menuRef = useRef(null);
    const [nomeUsuario, setNomeUsuario] = useState('');

    useEffect(() => {
        setNomeUsuario(
            JSON.parse(localStorage.getItem('@usuario')).nome_completo
        );
    }, [])

    const isSlim = () => {
        return props.menuMode === 'slim';
    };

    const isStatic = () => {
        return props.menuMode === 'static';
    };

    const isSidebar = () => {
        return props.menuMode === 'sidebar';
    };

    const isMobile = () => {
        return window.innerWidth <= 991;
    };

    const logout = function() {
        localStorage.clear();
        return window.location.href = '/';
    }

    return (
        <>
            {!isMobile() && (isStatic() || isSlim() || isSidebar()) && (
                <div className={classNames('layout-inline-menu', { 'layout-inline-menu-active': props.activeInlineProfile })}>
                    <button className="layout-inline-menu-action p-link" style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }} onClick={props.onChangeActiveInlineMenu}>
                        <img src="assets/layout/images/profile-image.png" alt="avatar" style={{ width: '44px', height: '44px' }} />
                        <span className="layout-inline-menu-text overflow-hidden">{ nomeUsuario }</span>
                        <i className="layout-inline-menu-icon pi pi-angle-down"></i>
                    </button>
                    <CSSTransition nodeRef={menuRef} classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={props.activeInlineProfile} unmountOnExit>
                        <ul ref={menuRef} className="layout-inline-menu-action-panel">
                            <li className="layout-inline-menu-action-item">
                                <button className="p-link" onClick={logout}>
                                    <i className="pi pi-power-off pi-fw"></i>
                                    <span>Sair</span>
                                </button>
                            </li>
                        </ul>
                    </CSSTransition>
                </div>
            )}
        </>
    );
};

export default AppInlineMenu;
