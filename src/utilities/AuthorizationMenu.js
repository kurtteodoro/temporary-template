const featuresAuthorizations  = [
    {
      label: 'Vendas',
      icon: 'pi pi-shopping-cart',
      to: '/vendas',
      authorizations :["ROLE_VISUALIZAR_VENDA"]
    },
    {
      label : "Cancelamento",
      icon: 'pi pi-lock',
      to : '/cancelamento',
      authorizations :["ROLE_CANCELAR_REMESSA"]
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
