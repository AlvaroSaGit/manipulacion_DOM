//import { get } from "../helpers/index.js"

//export const getUsers = async() => {
    //return get('users')
    
//}

export async function getUsers() {
    const response = await fetch('http://localhost:3000/users');
    return await response.json();
}