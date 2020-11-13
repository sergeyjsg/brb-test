
import { describe, it } from 'mocha';
import { testServer } from './init';


export default describe('Integration Test', () => {

    const adminUserStub = {
        firstName: "Admin",
        lastName: "Yarotskiy",
        email: "hello1@hello.com",
        role: "ADMIN"
    };

    const agentUserStub1 = {
        firstName: "Agent 1",
        lastName: "Yarotskiy",
        email: "hello2@hello.com",
        role: "AGENT"
    };

    const agentUserStub2 = {
        firstName: "Agent 2",
        lastName: "Yarotskiy",
        email: "hello2@hello.com",
        role: "AGENT"
    };

    const listingStub1 = { address: 'Toronto' };
    const listingStub2 = { address: 'London' };
    const listingStub3 = { address: 'Aurora' };
    const listingStub4 = { address: 'Ottawa' };


    describe('All endpoints should work as expected', () => {

        let adminUser: any = null;
        let agentUser1: any = null;
        let agentUser2: any = null;

        let listing1: any = null;
        let listing2: any = null;
        let listing3: any = null;
        let listing4: any = null;


        it('App should create users', async () => {
            const resAdmin = await testServer.post('/users/sign-up').send(adminUserStub);
            const resAgent1 = await testServer.post('/users/sign-up').send(agentUserStub1);
            const resAgent2 = await testServer.post('/users/sign-up').send(agentUserStub2);

            resAdmin.should.have.status(201);
            resAgent1.should.have.status(201);
            resAgent2.should.have.status(201);
            resAdmin.body.data.user.id.should.not.equal(null);
            resAgent1.body.data.user.id.should.not.equal(null);
            resAgent2.body.data.user.id.should.not.equal(null);

            adminUser = resAdmin.body.data.user;
            agentUser1 = resAgent1.body.data.user;
            agentUser2 = resAgent2.body.data.user;
        });


        it('App should authenticate users', async () => {
            const adminAuth = await testServer.post('/users/sign-in').send({ userId: adminUser.id });
            const agent1Auth = await testServer.post('/users/sign-in').send({ userId: agentUser1.id });
            const agent2Auth = await testServer.post('/users/sign-in').send({ userId: agentUser2.id });

            adminAuth.should.have.status(200);
            agent1Auth.should.have.status(200);
            agent2Auth.should.have.status(200);
            adminAuth.body.data.token.should.not.equal(null);
            agent1Auth.body.data.token.should.not.equal(null);
            agent2Auth.body.data.token.should.not.equal(null);

            adminUser.token = 'Bearer ' + adminAuth.body.data.token;
            agentUser1.token = 'Bearer ' + agent1Auth.body.data.token;
            agentUser2.token = 'Bearer ' + agent2Auth.body.data.token;
        });


        it('Should not create listings for admin', async () => {
            const response = await testServer.post('/listings').send(listingStub1).set('Authorization', adminUser.token);

            response.should.have.status(400);
        });


        it('App should create listings for agents', async () => {
            const response1 = await testServer.post('/listings').send(listingStub1).set('Authorization', agentUser1.token);
            const response2 = await testServer.post('/listings').send(listingStub2).set('Authorization', agentUser1.token);
            const response3 = await testServer.post('/listings').send(listingStub3).set('Authorization', agentUser2.token);
            const response4 = await testServer.post('/listings').send(listingStub4).set('Authorization', agentUser2.token);

            response1.should.have.status(201);
            response2.should.have.status(201);
            response3.should.have.status(201);
            response4.should.have.status(201);

            listing1 = response1.body.data.listing;
            listing2 = response2.body.data.listing;
            listing3 = response3.body.data.listing;
            listing4 = response4.body.data.listing;
        });


        it('App should return listing counts', async () => {
            const counts = await testServer.get('/users/counts');

            counts.should.have.status(200);
        });


        it('App should perform authorization check and do an ', async () => {
            const response1 = await testServer.put('/listings/1').send(listingStub2).set('Authorization', adminUser.token);
            const response2 = await testServer.put('/listings/1').send(listingStub2).set('Authorization', agentUser1.token);
            const response3 = await testServer.put('/listings/1').send(listingStub2).set('Authorization', agentUser2.token);
            const response4 = await testServer.get('/listings/1').set('Authorization', agentUser1.token);

            response1.should.have.status(200);
            response2.should.have.status(200);
            response3.should.have.status(400);
            response4.should.have.status(200);

            response4.body.data.listing.address.should.equal('London');
        });


        it('App should return list of listings', async () => {
            const response1 = await testServer.get('/users/3/listings').set('Authorization', agentUser2.token);

            response1.should.have.status(200);
            response1.body.data.listings.length.should.equal(2);
            response1.body.data.listings[1].address.should.equal('Ottawa');
        });


        it('App should delete listings', async () => {
            const response1 = await testServer.del('/listings/1').set('Authorization', adminUser.token);
            const response2 = await testServer.get('/users/2/listings').set('Authorization', agentUser1.token);
            const response3 = await testServer.get('/listings/1').set('Authorization', agentUser1.token);

            response1.should.have.status(204);
            response2.body.data.listings.length.should.equal(1);
            response3.should.have.status(404);
        });

    });

});
