const featuresAuthorizations  = [
    {
      label: 'Vendas',
      icon: 'pi pi-shopping-cart',
      to: '/',
      authorizations :["ROLE_EDITAR_USUARIO","ROLE_EDITAR_USUARIO", "ROLE_EDITAR_USUARIO"]
    },
    {
      label : "Remessas",
      icon: 'pi pi-shopping-cart',
      to : '/remessas',
      authorizations :["ROLE_EDITAR_USUARIO","ROLE_EDITAR_USUARIO", "ROLE_EDITAR_USUARIO"]
    }
  ];
  
  function generateArrayMenu() {
    try {
      console.log("generateArrayMenu")
      let authorizations = JSON.parse(localStorage.getItem("@authorities"));
      let filteredFeaturesAuthorizations = featuresAuthorizations.filter(
        element => 
          element.authorizations.some(e => authorizations.includes(e))
      );    
      return filteredFeaturesAuthorizations;
    } catch (ex) {
      return null;   
    }
  }  
  export default generateArrayMenu;