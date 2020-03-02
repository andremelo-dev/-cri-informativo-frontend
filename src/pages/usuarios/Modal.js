import React, { Component } from 'react';
import api from '../../api';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap';
import InputMask from 'react-input-mask';
import Axios from 'axios';
import * as moment from 'moment';
import './usuarios.css';
import { findRenderedDOMComponentWithClass } from 'react-dom/test-utils';

class Modal extends Component {

  state = {
    info: {},
    loading: false,
    mensagem: "",
    id_registro: 0,
    foto: null
  }

  constructor(props) {
    super(props);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }
  componentDidMount() {
    const { handleModalCloseClick, id_edit } = this.props;
    this.setState({ id_registro: id_edit });
    $(this.modal).modal('show');
    $(this.modal).on('hidden.bs.modal', handleModalCloseClick);
    if (id_edit >= 1) {
      this.informacao(id_edit);
    }
  }

  async informacao(id_edit) {
    const { data } = await api.get(`/user/${id_edit}`);
    data.data_nascimento = moment(data.data_nascimento).format('DD/MM/YYYY');
    this.setState({ info: data, foto:data.foto });
  }

  handleCloseClick() {
    const { handleModalCloseClick } = this.props;
    $(this.modal).modal('hide');
    handleModalCloseClick();
  }

  handleFormChange = ({ target }) => {
    this.setState(prev => ({
      info: { ...prev.info, [target.name]: target.value }
    }))


  }

  handleEnviar = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { addLista, attLista } = this.props;
    const { id_registro, info } = this.state;
    if (id_registro === 0) {
      await api.post(`/user`, info)
        .then(response => {
          this.mensagem('sucesso');
          response.data.data_nascimento = moment(response.data.data_nascimento).format('DD/MM/YYYY');
          this.setState({ id_registro: response.data.id, info: response.data });
          addLista(response.data);
        }).catch((error) => { this.mensagem(error); });
    } else {
      await api.put(`/user/${id_registro}`, info)
        .then(response => { this.mensagem('sucesso'); attLista(response.data); })
        .catch(() => { this.mensagem('error'); });
    }
    this.setState({ loading: false });
  }

  mensagem = (tipo) => {
    if (tipo === 'sucesso') {
      this.setState({ mensagem: <div className="alert alert-success" role="alert"><b>OK</b> - Salvo com sucesso!</div> });
    } else {
      this.setState({ mensagem: <div className="alert alert-danger" role="alert"><b>OPS</b> - Algum erro aconteceu!</div> });
    }
  }

  upFoto = async () => {
    const { id_registro } = this.state;
    var arquivo = document.querySelector('#arquivo');
   
    if (arquivo.files.length>=1) {
    for(let x=1; x<=arquivo.files.length; x++){
      let y = x-1;
      var formData = new FormData();
      formData.append("arquivo", arquivo.files[y]);
      api.post(`/user/upload/${id_registro}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(info => {
        $(this.arquivo).val('').empty();
        this.setState({foto:info.data.foto})
      }).catch(error => console.log(error))
    }
    } else {
      alert('anexe o arquivo');
    }

  }


  render() {
    const { info, loading, mensagem, id_registro, foto } = this.state;
    let host = process.env.REACT_APP_HOST_DEV;
    if (process.env.NODE_ENV == 'production') { host = process.env.REACT_APP_HOST_PROD; }
    return (
      <div>
        <div className="modal fade" ref={modal => this.modal = modal}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content"> <form onChange={this.handleFormChange} onSubmit={this.handleEnviar}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Usuário</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" ref={body => this.body = body}>

                <label className="col-md-3">Status
                <select className="form-control" name="desativado" value={info.desativado} required>
                    <option value="0">Ativo</option>
                    <option value="1">Desativado</option>
                  </select>
                </label>

                <label className="col-md-6">Nome
                <input type="text" name="nome" value={info.nome} className="form-control" required />
                </label>

                <label className="col-md-3">Master
                <select className="form-control" name="master" value={info.master} required>
                    <option value="0">Não</option>
                    <option value="1">Sim</option>
                  </select>
                </label>


                <label className="col-md-8">Email
                  <input type="email" name="email" value={info.email} className="form-control" required />
                </label>

                <label className="col-md-4">Senha
                  <input type="password" name="password" value={info.password} className="form-control" placeholder="informe se deseja alterar" />
                </label>

                {id_registro != 0 && <div className="imagens">
                  <h4>Imagem</h4>
                  <p id="foto-p">
                  {foto && <img id="foto-user" src={`${host}/user/${foto}`} />}
                  </p>

                  <label className="col-md-10">Foto Perfil
                <input type="file" className="form-control" id="arquivo" name="arquivo" ref={arquivo => this.arquivo = arquivo} />
                  </label>
                  <label className="col-md-2">
                    <button type="button" onClick={this.upFoto} className="btn btn-info">ATUALIZAR IMAGEM</button>
                  </label>
                </div>}


              </div>
              <div className="modal-footer">
                {mensagem}
                <button type="submit" className="btn btn-primary">
                  {loading && <i className="fas fa-sync-alt fa-spin"></i>}
                  Salvar</button>
                <button type="button" className="btn btn-secondary" onClick={this.handleCloseClick}>Cancelar</button>
              </div>
            </form></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;