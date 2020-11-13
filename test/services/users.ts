
import { describe, it } from 'mocha';
import { testServer } from '../init';


export default describe('Service - Claims', () => {

    const newUser = {
        firstName: "Sergey",
        lastName: "Yarotskiy",
        email: "hello@hello.com",
        role: "ADMIN"
    };

    const authUser = {
        userId: 1
    };

    describe('POST /users/sign-up', () => {

        it('Should create a user', async () => {
            const res = await testServer.post('/users/sign-up').send(newUser);
            res.should.have.status(201);
            res.should.have.header('Content-Type', 'application/json; charset=utf-8');
        });

    });


    describe('POST /users/sign-in', () => {

        it('Should authenticate a user', async () => {
            const res = await testServer.post('/users/sign-in').send(authUser);
            res.should.have.status(200);
            res.body.data.token.should.not.equal(null);
        });

    });

});
