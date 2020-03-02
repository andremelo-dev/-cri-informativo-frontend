import React, { Component, useState, useEffect } from 'react';
import Menu from '../../componentes/Menu';
import api from '../../api';
import { Link } from 'react-router-dom';
import './informativo.css';
import * as moment from 'moment';
import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";
import "lightgallery.js/dist/css/lightgallery.css";


import Ws from '@adonisjs/websocket-client';
const ws = Ws(process.env.REACT_APP_HOST_WS).connect();
ws.on('open', () => {})
const winfo = ws.subscribe('informativo');
winfo.on('alerta',(data)=>{
    new Notification('Informativo',{
        icon: './images/favicon.png',
        body: data
    })
}) 



function Informativo(props) {

  const [data, setData] = useState({});
  const [qtd, setQtd] = useState(0);
  const [comentarios, setComentarios] = useState([]);

  const anexos = data.imagens;
  let host = process.env.REACT_APP_HOST_DEV;
  if (process.env.NODE_ENV == 'production') { host = process.env.REACT_APP_HOST_PROD; }
  const user_padrao = './images/user.png';

  useEffect(() => {
    winfo.on('comentario',(data)=>{
      ProcuraComentarios();
    }) 
    const { id } = props.match.params;
    api.get(`/informativo/${id}`).then(info => {
      setData(info.data);
      setQtd(info.data.imagens.length);
    })
    ProcuraComentarios();
  }, []);

  function ProcuraComentarios() {
    const { id } = props.match.params;
    api.get(`/comentario/informativo/${id}`).then(info => setComentarios(info.data))
    console.log('executado');
  }

  function enviarComentario() {
    const { id } = props.match.params;
    const descricao = document.getElementById('comentario').value;
    api.post('/comentario', { informativo_id: id, descricao }).then(() => {
      document.getElementById('comentario').value = '';
      winfo.emit('comentario',true);
      ProcuraComentarios();
    })

  }


  return (
    <>
      <Menu />
      <div className="col-md-10 conteudo"><br />
        <Link to="/principal" className="btn btn-secondary"><i className="fas fa-arrow-left"></i> Voltar</Link>
        <h2>{data.titulo}</h2>
        <p className="descricao">{data.descricao}</p>

        {qtd >= 1 && <div id="imagens">
          <h4>Imagens:</h4>
          <LightgalleryProvider>
            {anexos.map(item => (
              <div key={item.id} className="itemImagem">
                <LightgalleryItem group="informacao" src={`${host}/${item.diretorio}/${item.arquivo}`}>
                  <img src={`${host}/${item.diretorio}/${item.arquivo}`} style={{ width: "100%" }} />
                </LightgalleryItem>
              </div>
            ))}
          </LightgalleryProvider>
        </div>}
        <div className="row col-md-12"></div><br /><br />
        {data.comentario == 1 && <div id="comentarios">

          <h4>Comentários:</h4><hr/>
          <div className="row">
            <div className="col-md-8 caixa-comentario">

              <ul className="comentarios">

                {comentarios.map(item => {
                  const user_img = item.usuario.foto ? `${host}/user/${item.usuario.foto}` : user_padrao;
                  return (
                    <li key={item.id}>
                      <div className="row">
                        <figure className="col-md-1 img"><img src={user_img} /></figure>
                        <div className="col-md-11">
                          <b>{item.usuario.nome}</b> - <span>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</span>
                          <p>{item.descricao}</p>
                        </div>
                      </div>
                    </li>
                  )
                }
                )}

              </ul>

            </div>
            <div className="col-md-4">
              <textarea
                name="comentario"
                id="comentario"
                className="form-control coment"
                placeholder="informe o comentário para cadastrar"></textarea>
              <p><button onClick={enviarComentario} className="btn btn-primary enviar">Enviar</button></p>
            </div>
          </div>


        </div>}

      </div>
    </>
  )
}


export default Informativo;