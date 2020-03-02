import React, { Component } from 'react';
import api from '../../api';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap';



class Modal extends Component {

  state = {
    info: {comentario:1},
    loading: false,
    mensagem: "",
    id_registro: 0,
    anexos: []
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
    const { data } = await api.get(`/informativo/${id_edit}`);
    this.setState({ info: data });
    this.anexos();
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
      console.log(info);
      await api.post(`/informativo`, info)
        .then(response => {
          this.mensagem('sucesso');
          this.setState({ id_registro: response.data.id, info: response.data });
          addLista(response.data);
        }).catch((error) => { this.mensagem(error); });
    } else {
      await api.put(`/informativo/${id_registro}`, info)
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

  addImagem = async () => {
    const { id_registro } = this.state;
    var arquivo = document.querySelector('#arquivo');
   
    if (arquivo.files.length>=1) {
    for(let x=1; x<=arquivo.files.length; x++){
      let y = x-1;
      var formData = new FormData();
      formData.append("arquivo", arquivo.files[y]);
      api.post(`/infoimg/${id_registro}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(data => {
        $(this.arquivo).val('').empty();
        this.anexos();
      }).catch(error => console.log(error))
    }

     

    } else {
      alert('anexe o arquivo');
    }

  }

  anexos = async () => {
    const { id_registro } = this.state;
    const anexos = await api.get(`/anexos/${id_registro}`);
    this.setState({ anexos: anexos.data });
  }

  deletarArquivo = async (id) => {
    let resposta = window.confirm('Deseja realmente excluir esse arquivo?');
    if (resposta) {
      await api.delete(`/infoimg/${id}`);
      this.anexos();
    }
  }

  extensao = (nome) => {
    let retorno = nome.split('.');
    return retorno[1];
  }



  render() {
    const { info, loading, mensagem, id_registro, anexos } = this.state;
    let host = process.env.REACT_APP_HOST_DEV;
    if (process.env.NODE_ENV == 'production') { host = process.env.REACT_APP_HOST_PROD; }
    return (
      <div>
        <div className="modal fade" ref={modal => this.modal = modal}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content"> <form onChange={this.handleFormChange} onSubmit={this.handleEnviar}>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Informativo</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" ref={body => this.body = body}>

                <label className="col-md-3">Comentário
                <select className="form-control" name="comentario" value={info.comentario} required>
                    <option value="1">Ativo</option>
                    <option value="0">Desativado</option>
                  </select>
                </label>

                <label className="col-md-9">Titulo
                <input type="text" name="titulo" value={info.titulo} className="form-control" placeholder="Titulo" required />
                </label>

                <label className="col-md-12">Descrição
                  <textarea name="descricao" value={info.descricao} placeholder="Descrição" className="form-control descricao" required ></textarea>
                </label>

                {id_registro != 0 && <div className="imagens">
                  <label className="col-md-10">Anexar Arquivos
                <input type="file" className="form-control" multiple id="arquivo" name="arquivo" ref={arquivo => this.arquivo = arquivo} />
                  </label>
                  <label className="col-md-2">
                    <button type="button" onClick={this.addImagem} className="btn btn-info">ADD IMAGEM</button>
                  </label>



                  <ul className="anexados">

                    {anexos.map(item => <li key={item.id}>
                      <div>

                        <div>
                          {this.extensao(item.arquivo) != 'pdf' && <img src={`${host}/${item.diretorio}/${item.arquivo}`} alt="imagem" />}
                          {this.extensao(item.arquivo) == 'pdf' && <i className="fas fa-file-pdf pdf"></i>}
                        </div>

                      </div>
                      <a onClick={() => this.deletarArquivo(item.id)} title="deletar"><i className="fas fa-trash img-delete"></i></a>
                    </li>)}

                  </ul>

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