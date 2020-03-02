import React, { Component } from 'react';
import './estilo.css';
import api from '../../api';
const { ipcRenderer } = window.require('electron');


class Login extends Component {

    state = {
        email: '',
        password: '',
        loading: false,
        erroSenha: false,
        ativos: []
    }

    componentDidMount() {
        this.ativos();
        localStorage.removeItem('reload');
    }

    ativos = async () => {
        const ativos = await api.get('/user/ativos');
        this.setState({ ativos: ativos.data });
    }

    enviaForm = async (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const user = {
            email: this.state.email,
            password: this.state.password
        }

        await api.post('/user/autenticar', user)
            .then(response => {
                localStorage.setItem('cri_informativo_token', response.data.token);
                localStorage.setItem('cri_informativo_user', JSON.stringify(response.data.user));
                this.principal();
            })
            .catch(error => {
                this.setState({ erroSenha: true });
            });
        this.setState({ loading: false });
    }

    fecharJanela() {
        ipcRenderer.send('fechar');
    }

    principal() {
        this.props.history.push("/principal");
    }

    handleInputChange = ({ target }) => this.setState({ [target.name]: target.value });

    render() {
        const { email, password, loading, erroSenha, ativos } = this.state;
        return (
            <div id="bg-login">
                <button className="btn btn-danger fechar" title="fechar" onClick={this.fecharJanela}>X</button>
                <div className="caixa">
                    <figure><img src='./images/logo1.png' alt="imagem" /></figure>

                    <form onSubmit={this.enviaForm}>
                        <div className="form-group">
                            <label>Usuário
                        <select className="form-control" name="email" value={email} onChange={this.handleInputChange} required>
                                    <option value="">Selecione</option>
                                    {ativos.map(item => <option key={item.id} value={item.email}>{item.nome}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className="form-group">
                            <label>Senha
                        <input
                                    onChange={this.handleInputChange}
                                    value={password}
                                    type="password" name="password" className="form-control form-control-lg" required />
                            </label>
                        </div>
                        <button type="submit" className="btn btn-lg btn-beno1" disabled={loading}>
                            {loading && <i className="fas fa-sync-alt fa-spin"></i>}
                            Entrar
                         </button>
                    </form>
                    {erroSenha && <p className="text-danger text-center">Email ou senha inválida</p>}
                </div>

            </div>
        )
    }
}

export default Login;