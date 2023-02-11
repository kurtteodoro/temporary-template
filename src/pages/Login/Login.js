import React, {useRef, useState} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import InputMask from 'react-input-mask';
import UsuarioServiceAPI from "../../service/UsuarioServiceAPI";
import {formatCNPJ, validCnpj, validCpf} from "./validacoes";
import {Toast} from "primereact/toast";
import jwt_decode from "jwt-decode";

const Login = (props) => {

    const [carregandoResquest, setCarregandoRequest] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [ctrl, setCtrl] = useState(1);
    const [lastCharIs, setLastCharIs] = useState('');
    var buff;
    const toast = useRef();

    const saveBuff = function(event) {
        buff = event.key;
    }

    function handleMaskChange(event) {
        setErrorLogin('');
        const valor = event.target.value.replace(/\D/g,'');
        if(lastCharIs && valor.length == 11) {
            setCtrl(2);
            setLogin(valor+buff);
            setTimeout(() => {
                document.querySelector('#inputCNPJRef').value = formatCNPJ(valor+buff);
            }, 50);
        } else {
            setLogin(valor);
            setLastCharIs(valor.length > 10);
        }

        if(valor.length == 11 && ctrl == 2)
            setCtrl(1);

    }

    const handleOnSubmit = async function(e) {
        e.preventDefault();

        if(!validCpf(login) && !validCnpj(login)) {
            setErrorLogin('p-invalid');
            return;
        }

        const usuarioServiceAPI = new UsuarioServiceAPI();

        try {
            setCarregandoRequest(true);
            const res = await usuarioServiceAPI.logarUsuario(login, senha);
            const data = jwt_decode(res.data.access_token);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Login realizado com sucesso, você será redirecionado em breve', life: 3000 });
            localStorage.setItem("@token", res.data.access_token);
            localStorage.setItem("@authorities", JSON.stringify(data.authorities))
            localStorage.setItem("@usuario", JSON.stringify({
                nome_completo: data.nome_completo,
                usuario_id: data.usuario_id,
                empresa_id: res.data.empresa_id
            }));
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (ex) {
            switch (ex?.response?.status) {
                case 400:
                case 401:
                    toast.current.show({ severity: 'error', summary: 'Tente novamente', detail: 'Credenciais inválidas, tente novamente', life: 3000 });
                    break;
                default:
                    toast.current.show({ severity: 'error', summary: 'Tente novamente', detail: 'Houve um erro inesperado, tente novamente', life: 3000 });
                    break;
            }
            setCarregandoRequest(false);
            localStorage.clear();
        }

    }

    return (
        <div className="login-body">
            <div className="">
                <img src={`assets/layout/images/pages/login-${props.colorScheme === 'light' ? 'ondark' : 'onlight'}.png`} alt="atlantis" />
            </div>
            <div className="login-panel p-fluid">
                <div className="flex flex-column">
                    <form onSubmit={handleOnSubmit}>
                        <Toast ref={toast} />
                        <div className="flex align-items-center mb-6 logo-container just">
                            <img src={`/assets/images/removebg.png`} className="login-logo" alt="login-logo" />
                            <img src={`assets/images/logo-maxtool.svg`} className="login-appname" alt="login-appname" />
                        </div>
                        <div className="form-container">
                            <span className="p-input-icon-left">
                                <i className="pi pi-user"></i>
                                {
                                    ctrl == 1 ?
                                        <InputMask
                                            mask="999.999.999-99"
                                            onChange={handleMaskChange}
                                            value={ login }
                                            maskChar=""
                                            noSpaceBetweenChars={true}
                                        >
                                            {(inputProps) => <InputText className={errorLogin ? errorLogin + " mb-0" : ''} onKeyDown={saveBuff} type="text" placeholder="CPF ou CNPJ" />}
                                        </InputMask>
                                        :
                                        <InputMask
                                            mask="99.999.999/9999-99"
                                            onChange={handleMaskChange}
                                            value={ login }
                                            maskChar=""
                                            noSpaceBetweenChars={true}
                                        >
                                            {(inputProps) => <InputText id="inputCNPJRef" onKeyDown={saveBuff} type="text" placeholder="CPF ou CNPJ" />}
                                        </InputMask>
                                }
                            </span>
                            {
                                errorLogin && (
                                    <div className="p-error mb-2" style={{ textAlign: 'left'}}>
                                        <small>
                                            CPF ou CNPJ Inválido
                                        </small>
                                    </div>
                                )
                            }
                            <span className="p-input-icon-left">
                                <i className="pi pi-key"></i>
                                <InputText value={senha} onChange={e => setSenha(e.target.value)} required type="password" placeholder="Senha de acesso" />
                            </span>
                        </div>
                        <div className="button-container">
                            <Button loading={carregandoResquest} type="submit" label="Login"></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
