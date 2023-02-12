
export default function  hasRole(role){
    let authorizations = JSON.parse(localStorage.getItem("@authorities"));
    return authorizations.Some(role)
}