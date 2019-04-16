const assert = require('assert');
const axios = require('axios');

describe('REST', () => {
    describe('Create', () => {

        it('should create a user on the system', async function() {
            this.timeout(0);
            try {
                const response = await axios.get('http://localhost:9000/ws/users');
                console.log('tototiti', response.data);
                assert.deepStrictEqual(response.data, []);
            } catch (err) {
                assert.fail('request failed');
            }
        });

    });
});