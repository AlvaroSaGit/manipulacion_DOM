import { get } from "../helpers/index.js"

export const getUsers = async() => {
    return get('users')
    
}