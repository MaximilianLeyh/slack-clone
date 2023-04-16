export class Post {
    userId: string;   //Id of the  user
    isRead: string[];   //userId's of useres who read
    conversationId: string; //name of channel or chat
    conversationType: string; //channel or chat
    timeStamp: number;  //timestamp 
    message: string;    //the postmessage
    activeUser: number; //userID-Index of active user
    subPost: boolean;   //true if active user is posting again

    constructor(obj?: any) {
        this.userId = obj ? obj.userId : '';
        this.isRead = obj ? obj.isRead : '';
        this.conversationId = obj ? obj.conversationId : '';
        this.conversationType = obj ? obj.conversationType : '';
        this.timeStamp = obj ? obj.timeStamp : '';
        this.message = obj ? obj.message : '';
        this.activeUser = obj ? obj.activeUser : '';
        this.subPost = obj ? obj.subPost : '';
    }

    public toJSON() {
        return {
            userId: this.userId,
            isRead: this.isRead,
            conversationId: this.conversationId,
            conversationType: this.conversationType,
            timeStamp: this.timeStamp,
            message: this.message,
            activeUser: this.activeUser,
            subPost: this.subPost
        }
    }
}