import { getUsers } from './getUsers.js';

export async function getUserByDocument(documento) {
    const users = await getUsers();
    return users.find(user => user.documento === documento);
}