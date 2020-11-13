
import { message } from '../utils/message';


export const userMessage = (ininObj: any) => {
    return message(ininObj, (inObj: any) => {
        return {
            id: inObj.id,
            firstName: inObj.firstName,
            lastName: inObj.lastName,
            role: inObj.role
        };
    });
};
