export const isAuthenticated = () => {
    if(localStorage.getItem('cri_informativo_token')){
        return true;
    }else{
        return false;
    }
}

export const Usuario = JSON.parse(localStorage.getItem('cri_informativo_user'));