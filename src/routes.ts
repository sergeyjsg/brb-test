/**
 * Koa-router-compatible routes file
 *
 * Routes are hosted in this separate file to unlock usage in both runtime and testing.
 * Check /src/index.ts and /test/init.ts for more examples
 */

import * as Router from '@koa/router';
import anonymousAction from './classes/actions/AnonymousAction';
import userAction from './classes/actions/UserAction';
import { listingCreationSchema, signInSchema, signUpSchema } from './definitions/schemas';
import listings from './services/listings';
import users from './services/users';


const router = new Router();

router.post('/users/sign-in', anonymousAction(users.signIn, signInSchema));
router.post('/users/sign-up', anonymousAction(users.signUp, signUpSchema));
router.get('/users', anonymousAction(users.list));
router.get('/users/counts', anonymousAction(users.counts));

router.get('/users/:userId/listings', userAction(listings.list));

router.get('/listings/:listingId', userAction(listings.item));
router.post('/listings', userAction(listings.create, listingCreationSchema));
router.put('/listings/:listingId', userAction(listings.update));
router.del('/listings/:listingId', userAction(listings.remove));


export default router;
