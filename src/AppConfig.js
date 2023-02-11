import React from 'react';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';

const AppConfig = (props) => {
    const themes = [
        { name: 'blue', color: '#0F8BFD' },
        { name: 'green', color: '#0BD18A' },
        { name: 'magenta', color: '#EC4DBC' },
        { name: 'orange', color: '#FD9214' },
        { name: 'purple', color: '#873EFE' },
        { name: 'red', color: '#FC6161' },
        { name: 'teal', color: '#00D0DE' },
        { name: 'yellow', color: '#EEE500' }
    ];

    const componentThemes = [
        { name: 'blue', color: '#0F8BFD' },
        { name: 'green', color: '#0BD18A' },
        { name: 'magenta', color: '#EC4DBC' },
        { name: 'orange', color: '#FD9214' },
        { name: 'purple', color: '#873EFE' },
        { name: 'red', color: '#FC6161' },
        { name: 'teal', color: '#00D0DE' },
        { name: 'yellow', color: '#EEE500' }
    ];

    return (
        <div id="layout-config">
            <button id="layout-config-button" className="layout-config-button p-link" onClick={props.onConfigButtonClick}>
                <i className="pi pi-cog"></i>
            </button>
            <div className={classNames('layout-config', { 'layout-config-active': props.configActive })} onClick={props.onConfigClick}>
                <h5>Menu Type</h5>
                <div className="field-radiobutton">
                    <RadioButton name="menuMode" value="static" id="mode1" checked={props.menuMode === 'static'} onChange={() => props.changeMenuMode('static')}></RadioButton>
                    <label htmlFor="mode1">Static</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton name="menuMode" value="overlay" id="mode2" checked={props.menuMode === 'overlay'} onChange={() => props.changeMenuMode('overlay')}></RadioButton>
                    <label htmlFor="mode2">Overlay</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton name="menuMode" value="slim" id="mode3" checked={props.menuMode === 'slim'} onChange={() => props.changeMenuMode('slim')}></RadioButton>
                    <label htmlFor="mode3">Slim</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton name="menuMode" value="horizontal" id="mode4" checked={props.menuMode === 'horizontal'} onChange={() => props.changeMenuMode('horizontal')}></RadioButton>
                    <label htmlFor="mode4">Horizontal</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton name="menuMode" value="sidebar" id="mode5" checked={props.menuMode === 'sidebar'} onChange={() => props.changeMenuMode('sidebar')}></RadioButton>
                    <label htmlFor="mode5">Sidebar</label>
                </div>
                <hr />

                <h5>Color Scheme</h5>
                <div className="field-radiobutton">
                    <RadioButton name="colorScheme" value="light" id="theme1" checked={props.colorScheme === 'light'} onChange={() => props.changeColorScheme('light')}></RadioButton>
                    <label htmlFor="theme1">Light</label>
                </div>
                <div className="field-radiobutton">
                    <RadioButton name="colorScheme" value="dark" id="theme2" checked={props.colorScheme === 'dark'} onChange={() => props.changeColorScheme('dark')}></RadioButton>
                    <label htmlFor="theme2">Dark</label>
                </div>
                <hr />

                <h5>Ripple Effect</h5>
                <InputSwitch checked={props.ripple} onChange={props.onRippleChange} />
                <hr />

                <h5>Layout Themes</h5>
                <div className="layout-themes">
                    {themes.map((t) => {
                        return (
                            <div key={t.name}>
                                <button className="p-link" style={{ cursor: 'pointer', backgroundColor: t.color }} onClick={() => props.changeTheme(t.name)} title={t.name}>
                                    {props.theme === t.name && <i className="pi pi-check"></i>}
                                </button>
                            </div>
                        );
                    })}
                </div>
                <hr />

                <h5>Component Themes</h5>
                <div className="layout-themes">
                    {componentThemes.map((theme) => {
                        return (
                            <div key={theme.name}>
                                <button className="p-link" style={{ cursor: 'pointer', backgroundColor: theme.color }} onClick={() => props.changeComponentTheme(theme.name)} title={theme.name}>
                                    {props.componentTheme === theme.name && <i className="pi pi-check"></i>}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AppConfig;
