import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Int = "mo:base/Int"

actor {
    public type Message = (
        text: Text,
        time: Time.Time
    );

    public type Microblog = actor {
        follow: shared(Principal) -> async ();
        follows: shared query () -> async [Principal];
        post: shared (Text) -> async ();
        posts: shared query (since: Time.Time) -> async [Message];
        timeline: shared (since: Time.Time) -> async [Message];
    };

    stable var followed : List.List<Principal> = List.nil();

    public shared func follow(id: Principal) : async() {
        followed := List.push(id, followed);
    };

    public shared query func follows() : async [Principal]{
        List.toArray(followed);
    };

    stable var message : List.List<Message> = List.nil();

    public shared func post(text: Text) : async(){
        let time: Time.Time = Time.now(); 
        let msg: Message = (text, time);
        message := List.push(msg, message);
    };

 
    public shared query func posts(since: Time.Time) : async [Message] {
        var own : List.List<Message> = List.nil();
        for (msg in Iter.fromList(message)){
            if (msg.1>=since){
                own := List.push(msg, own);
            };
        };
        List.toArray(own)
    };

    public shared func timeline(since: Time.Time) : async [Message]{
        var all : List.List<Message> = List.nil();

        for (id in Iter.fromList(followed)){
            let canister :  Microblog = actor(Principal.toText(id));
            let msgs = await canister.posts(since);
            for (msg in Iter.fromArray(msgs)){
                all := List.push(msg, all)
            }    
        };
        List.toArray(all)
    };
}
