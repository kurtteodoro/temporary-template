
export default function  hasRole(role){    
   
    console.log(`hasRole `)
    const authorizations = JSON.parse(localStorage.getItem("@authorities"));
    return authorizations.includes(role);
}