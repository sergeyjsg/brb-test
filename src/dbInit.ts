
/**
 * DB Init module is responsible for DB schema synchronization.
 * In real life applications it is not a recommended approach. Schema migrations tools are more preferred.
 */

import User from './models/User';
import Listing from './models/Listing';
import AgentListing from './models/AgentListing';


export default async function () {
    await User.sync({ force: true });
    await Listing.sync({ force: true });
    await AgentListing.sync({ force: true });
}
