import React, { Component } from 'react';
import './css/menu.css';
import {  Link, NavLink } from 'react-router-dom';

class Menu extends Component {
    state = {
        usuario : JSON.parse(localStorage.getItem('cri_informativo_user'))
    }
 
    sair = () => {
        localStorage.removeItem('cri_informativo_token');
        localStorage.removeItem('cri_informativo_user');
        localStorage.removeItem('reload');
    }   


    componentDidMount() {
        if(!localStorage.getItem('reload')){
            localStorage.setItem('reload', true);
            window.location.reload();
        }
    }

    render() {

        const Usuario = this.state.usuario;

        return (
            <div className="col-md-2 menu"> <h5 id="user">{Usuario.nome}</h5>
                <figure><img src='./images/logo2.png' alt="imagem" /></figure>
       
                <ul>
                    <li><NavLink activeClassName="ativo" to="/principal"><i className="fas fa-tachometer-alt"></i> Principal</NavLink></li>
                    {Usuario.master==1 && <li><NavLink activeClassName="ativo" to="/informativos"><i className="fas fa-info-circle"></i> Informativos</NavLink></li>}
                    {Usuario.master==1 && <li><NavLink activeClassName="ativo" to="/usuarios"><i className="fas fa-users"></i> Usuários</NavLink></li>}
                </ul> 
                    <Link onClick={this.sair} id="sair" to="/">Sair <i className="fas fa-sign-out-alt"></i></Link>
            </div>

        )
    }

}

export default Menu;