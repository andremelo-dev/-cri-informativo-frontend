import React, { Component } from 'react';
import Menu from '../../componentes/Menu';
import { DataTable } from '../../componentes/DataTable';
import api from '../../api';
import Editar from '../../componentes/Editar';
import Modal from './Modal';
import './informativos.css';

import Ws from '@adonisjs/websocket-client';
const ws = Ws(process.env.REACT_APP_HOST_WS).connect();
ws.on('open', () => {})
const winfo = ws.subscribe('informativo');

class Informativos extends Component {

  state = {
    showModal: false,
    id_edit: 0,
    data: [],
    columns: [
      { label: "ID", name: "id" },
      { label: "Titulo", name: "titulo" },
      {
        label: "Comentário", name: "comentario", options: {
          customBodyRender: (event) => {
            if (event == 1) { return <b className="text-info">Ativo</b>; } else { return <b className="text-danger">Desativado</b>; }
          }
        }
      },
      {
        label: "Ação", name: "id",
        options: {
          customBodyRender: (event) =>
            <Editar event={event} EditarRow={() => this.EditarRow(event)} />
        }
      }
    ]
  };


  constructor(props) {
    super(props);
    this.cadastrar = this.cadastrar.bind(this);
    this.handleModalCloseClick = this.handleModalCloseClick.bind(this);
  }


  async componentDidMount() {
    await api.get('/informativo').then(info => { this.setState({ data: info.data }); })

  }


  EditarRow = (id_edit) => {
    this.setState({ showModal: true, id_edit })
  }

  cadastrar() {
    this.setState({ showModal: true, id_edit: 0, table: [] })
  }

  addLista = (info) => {
    winfo.emit('alerta',info.titulo);
    this.setState(prev => ({ data: [...prev.data, info,] }));
  }

  attLista = (info) => {
    winfo.emit('alerta',info.titulo);
    var lista = this.state.data;
    const antigo = lista.filter(function (item) { return item.id == info.id });
    lista[lista.indexOf(antigo[0])] = info;
    this.state.data = lista;
    this.setState(prev => ({ data: [...prev.data] }))
    
  }


  handleModalCloseClick() {
    this.setState({ showModal: false })
  }



  render() {
    const { data, columns, showModal } = this.state;

    return (
      <>
        <Menu emit={this.emit} />
        <div className="col-md-10 conteudo">
          <h2><i className="fas fa-info-circle"></i> Informativos
          <button className="bnt btn-primary add" onClick={this.cadastrar}><i className="fas fa-plus"></i> ADICIONAR</button>
          </h2>
          <DataTable data={data} columns={columns} />
        </div>


        {showModal ? (<Modal
          id_edit={this.state.id_edit}
          attLista={this.attLista}
          addLista={this.addLista}
          handleModalCloseClick={this.handleModalCloseClick} />) : null}
      </>
    )
  }
}

export default Informativos;