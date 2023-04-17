import { Post } from "./post.class";

export class Conversation {
    posts: any[];   //posts of the conversation
    conversationId: string; //name of channel or chat
    conversationType: string; //channel or chat

    constructor(obj?: any) {
        this.posts = [];
        this.conversationId = obj ? obj.conversationId : '';
        this.conversationType = obj ? obj.conversationType : '';
    }

    public toJSON() {
        return {
            posts: this.posts,
            conversationId: this.conversationId,
            conversationType: this.conversationType,
        }
    }
}