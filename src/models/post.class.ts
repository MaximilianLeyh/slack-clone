export class Post {
    userId: String;   //Id of the  user
    isRead: String[];   //userId's of useres who read
    conversationId: String; //name of channel or chat
    conversationType: String; //channel or chat
    timeStamp: number;  //timestamp 
    message: String;    //the postmessage
    activeUser: number; //userID-Index of active user
    subPost: boolean;   //true if active user is posting again
    threadId: String;
    threadAmount: number;
    customIdName: string;

    Weekdays = ['Sunnday','Monday','Thuesday','Wednesday','Thursday','Friday', 'Saturday']

    constructor(obj?: any) {
        this.userId = obj ? obj.userId : '';
        this.isRead = obj ? obj.isRead : '';
        this.conversationId = obj ? obj.conversationId : '';
        this.conversationType = obj ? obj.conversationType : '';
        this.timeStamp = obj ? obj.timeStamp : '';
        this.message = obj ? obj.message : '';
        this.activeUser = obj ? obj.activeUser : '';
        this.subPost = obj ? obj.subPost : '';
        this.threadId = obj ? obj.threadId : '';
        this.threadAmount = obj ? obj.threadAmount : '';
        this.customIdName = obj ? obj.customIdName : '';
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
            subPost: this.subPost,
            threadId: this.threadId,
            threadAmount: this.threadAmount,
            customIdName: this.customIdName
        }
    }

    public getTime(){
        let date  = new Date(this.timeStamp);
        let time = this.Weekdays[date.getDay()] +" "+ date.getHours() +":"+ date.getMinutes() + " Uhr";
        return time
    }

    public getUserName(){
        let userName = "tbd";
        return userName;
    }
}