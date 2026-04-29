import { get } from "../helper/index.js"

export const getUsers = async() => {
    return get('users')
}