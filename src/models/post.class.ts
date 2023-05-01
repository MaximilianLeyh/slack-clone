export class Post {
    userId?: string;   //Id of the  user
    isRead?: string[];   //userId's of useres who read
    conversationId?: string; //name of channel or chat
    conversationType?: string; //channel or chat
    timeStamp: number;  //timestamp 
    message?: string;    //the postmessage
    activeUser?: number; //userID-Index of active user
    subPost?: boolean;   //true if not main thread
    subThread?: boolean;
    threadId?: string;   //if chat it's the ohter user 
    threadAmount?: number;
    customIdName?: string; //document number in firebase

    // public toJSON() {
    //     return {
    //         userId: this.userId,
    //         isRead: this.isRead,
    //         conversationId: this.conversationId,
    //         conversationType: this.conversationType,
    //         timeStamp: this.timeStamp,
    //         message: this.message,
    //         activeUser: this.activeUser,
    //         subPost: this.subPost,
    //         threadId: this.threadId,
    //         threadAmount: this.threadAmount,
    //         customIdName: this.customIdName
    //     }
    // }

}