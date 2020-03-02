import React from 'react';
import './estilo.css';
import Menu from '../../componentes/Menu';
import Esquerda from './Esquerda';
import Direita from './Direita';

function Principal() {

    return (
        <>
            <Menu />
            <div className="col-md-10 conteudo">
                <Esquerda />
                <Direita />
            </div>
        </>
    )

}

export default Principal;