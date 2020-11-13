
import { message } from '../utils/message';
import { userMessage } from './users';


export const listingMessage = (ininObj: any, indexedListingAgents: any, indexedUsers: any) => {
    return message(ininObj, (inObj: any) => {
        return {
            id: inObj.id,
            address: inObj.address,
            listingAgents: indexedListingAgents[inObj.id]
                ? indexedListingAgents[inObj.id].map((userId: number) => userMessage(indexedUsers[userId]))
                : []
        };
    });
};
