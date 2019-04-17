import * as assert from 'assert';
import axios from 'axios';
import { port, listen } from '../express';


const http = axios.create({
    baseURL: `http://localhost:${port}/ws/users`,
});

describe('REST', function () {
    this.timeout(0);

    let server;
    
    let id = 0;

    const obj = {
        firstName: 'Fred',
        lastName: 'Flintstone'
    };
    let user;

    it('should start the server', async () => {
        server = await listen();
    });

    it('should delete all users', async () => {
        const response = await http.delete('');
        assert.deepStrictEqual(response.status, 204);
    });

    it('should retrieve no users', async () => {
        const response = await http.get('');
        assert.deepStrictEqual(response.data, []);
    });

    it('should create a user', async () => {
        const response = await http.post('', obj);
        assert.deepStrictEqual(response.status, 201);
        user = { ...obj, id: response.data.id };
        id = response.data.id;
        assert.deepStrictEqual(response.data, user);
    });

    it('should retrieve one user', async () => {
        const response = await http.get('' + id);
        assert.deepStrictEqual(response.data, user);
    });

    it('should stop the server', done => {
        server.close(done);
    });


});