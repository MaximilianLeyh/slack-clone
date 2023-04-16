import { Post } from "./post.class";

export class Conversation {
    posts: Post[];   //userId's of useres who read
    conversationId: string; //name of channel or chat
    conversationType: string; //channel or chat

    constructor(obj?: any) {
        this.posts = obj ? obj.posts : '';
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