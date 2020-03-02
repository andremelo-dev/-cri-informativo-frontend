import React, { Component, useState } from 'react';
import './estilo.css';
import api from '../../api';
import {Link} from 'react-router-dom';
import * as moment from 'moment';

import Ws from '@adonisjs/websocket-client';
const ws = Ws(process.env.REACT_APP_HOST_WS).connect();
ws.on('open', () => console.log('conectado'))
const winfo = ws.subscribe('informativo');
winfo.on('alerta',(data)=>{
    console.log('recebendo alerta');
    new Notification('Informativo',{
        icon: './images/favicon.png',
        body: data
    })
}) 

class Esquerda extends Component {

    state = {
        data: []
    }

    async componentDidMount() {
        await api.get('/informativo/ativos').then(info => { this.setState({ data: info.data }); })

    }

    render() {
        const { data } = this.state;

        return (
                <div className="info-conteudo">
                    <h1>Informativos</h1>

                    {data.map(info => (

                        <div className="card" key={info.id}>
                            <div className="card-header">{moment(info.created_at).format('DD/MM/YYYY HH:mm')}</div>
                            <div className="card-body">
                                <h5 className="card-title">{info.titulo}</h5>
                                <p className="card-text">{(info.descricao)}</p>
                                <Link to={`/informativo/${info.id}`} className="btn btn-primary">
                                    <i className="fas fa-eye"></i> Visualizar</Link>
                            </div>
                        </div>

                    ))}


                </div>
        );
    }


}

export default Esquerda;