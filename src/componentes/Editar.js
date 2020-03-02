import React from 'react';
const Editar = ({EditarRow,event}) =>  {
            return (
                <button  className="btn btn-sm btn-warning text-white"
                onClick={() => EditarRow(event)}
                >
                    <i className="fas fa-edit"></i>
                </button>
            )
}

export default Editar;