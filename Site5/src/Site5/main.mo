import List "mo:base/List";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Bool "mo:base/Bool";
import Int = "mo:base/Int";
import Option = "mo:base/Option";

actor {
    public type Message = {
        author: Text;
        text: Text;
        time: Time.Time;
    };
    
    let otp_r = "12345678";    
    
    stable var author_name: Text = "Junweif";

    stable var message : List.List<Message> = List.nil();

    public type Microblog = actor {
        set_name: shared(Text) -> async ();
        get_name: shared query() -> async ?Text;
        follow: shared(Principal) -> async ();
        follows: shared query () -> async [Principal];
        post: shared (Text) -> async ();
        posts: shared query (since: Time.Time) -> async [Message];
        timeline: shared (since: Time.Time) -> async [Message];
    };

    stable var followed : List.List<Principal> = List.nil();

    public shared func follow(otp: Text, id: Principal) : async() {
        assert(otp == otp_r);        
        followed := List.push(id, followed);
    };

    public shared query func follows() : async [Principal]{
        List.toArray(followed);
    };

    public shared func set_name(otp: Text, name: Text): async() {
        assert(otp == otp_r);
        author_name := name;
    };
 
    public shared query func get_name(): async ?Text {
        ?author_name;
    };

    public shared func post(otp: Text, text: Text) : async(){
        assert(otp == otp_r);
        let time: Time.Time = Time.now(); 
        let author: Text = author_name;
        let msg: Message = {author; text; time};
        message := List.push(msg, message);
    };

    public shared query func posts(since: Time.Time) : async [Message] {
        var own : List.List<Message> = List.nil();
        for (msg in Iter.fromList(message)){
            if (msg.time>=since){
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
