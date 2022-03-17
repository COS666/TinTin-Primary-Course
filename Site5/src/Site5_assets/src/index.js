// 引用后端的Canister
import { Site5 } from "../../declarations/Site5";
import {createActor} from "../../declarations/Site5/index.js";
import { Principal } from '@dfinity/principal';

async function post(){
  let post_button = document.getElementById("post");
  let error = document.getElementById("post_error");
  error.innerText = "";
  post_button.disabled = true;
  let textarea = document.getElementById("message");
  let otp = document.getElementById("otp1").value;
  let text = textarea.value;
  try {
    await Site5.post(otp, text);
    textarea.value = "";
  } catch (err) {
    console.log(err)
    document.getElementById("post_error").innerText = "Post Failed";
  }
  post_button.disabled = false;
}

async function follow(){
  let follow_button = document.getElementById("follow");
  let error = document.getElementById("follow_error");
  error.innerText = "";
  follow_button.disabled = true;
  let textarea = document.getElementById("author");
  let otp = document.getElementById("otp2").value;
  let text = textarea.value;
  try {
    await Site5.follow(otp, Principal.fromText(text));
    textarea.value = "";
  } catch (err) {
    console.log(err)
    document.getElementById("follow_error").innerText = "Follow Failed";
  }
  follow_button.disabled = false;
}

var num_follows = 0;
var follows = [];
async function load_follows() {
  let follows_section = document.getElementById("follows");
  follows = await Site5.follows();
  if (num_follows != follows.length) {
    follows_section.replaceChildren([]);
  } else {
    return;
  }
  num_follows = follows.length;
  for (var i=0; i < follows.length; i++) {
    let row = document.createElement("tr");
    let principal_id = document.createElement('td');
    principal_id.innerText = follows[i];

    let actor = createActor(follows[i]);
    let name = document.createElement('td');
    name.onclick = get_follow_posts;

    try {
      name.innerText = await actor.get_name();
    } catch (err) {
      console.log(err);
      name.innerText = "failed to fetch name";
    } 
    row.appendChild(name);
    row.appendChild(principal_id);
    follows_section.appendChild(row);

    async function get_follow_posts(){
      let follow_posts = document.getElementById("get_posts");
      let author_name = document.getElementById("author_name");
      author_name.innerText = await actor.get_name() + "'s Posts";
      follow_posts.innerText = "";
      var content  = await actor.posts(0);
      for (var i=0; i < content.length; i++) {
        let time_i = new Date(Number(content[i].time)/1e6);
        let timeat_i = time_i.toLocaleDateString() + " " + time_i.toLocaleTimeString();
        follow_posts.innerText += timeat_i + "\t";
        let text_i = content[i].text;
        follow_posts.innerText += text_i + "\n";
      }
    }
  }
}

var num_posts = 0;
async function load_posts(){
  let posts_section = document.getElementById("posts");
  let posts = await Site5.posts(0);
  if (num_posts == posts.length) return;
  posts_section.replaceChildren([]);
  num_posts = posts.length;
  for (var i=0; i < posts.length; i++) {
    let row = document.createElement("tr");
    // let author = document.createElement('td');
    // author.innerText = posts[i].author;
    let time = document.createElement('td');
    let datatime = new Date(Number(posts[i].time)/1e6);
    time.innerText = datatime.toLocaleDateString() + " " + datatime.toLocaleTimeString();
    let post = document.createElement('td');
    post.innerText = posts[i].text;
    // row.appendChild(author);
    row.appendChild(time);
    row.appendChild(post);
    posts_section.appendChild(row);
  }
}

var num_timeline = 0;
async function load_timeline(){
  let timeline_section = document.getElementById("timeline");
  let timeline = await Site5.timeline(0);
  if (num_timeline == timeline.length) return;
  timeline_section.replaceChildren([]);
  num_timeline = timeline.length;
  for (var i=0; i < timeline.length; i++){
    let row = document.createElement("tr");

    let author = document.createElement('td');
    author.innerText = timeline[i].author;
    let time = document.createElement('td');
    let datatime = new Date(Number(timeline[i].time)/1e6);
    time.innerText = datatime.toLocaleDateString() + " " + datatime.toLocaleTimeString();
    let post = document.createElement('td');
    post.innerText = timeline[i].text;
    
    row.appendChild(author);
    row.appendChild(time);
    row.appendChild(post);
    timeline_section.appendChild(row);
  }
}

function load(){
  let post_button = document.getElementById("post");
  post_button.onclick = post;
  let follow_button = document.getElementById("follow");
  follow_button.onclick = follow;
  load_posts()
  load_timeline()
  load_follows()
  setInterval(load_posts, 3000)
  setInterval(load_timeline, 3000)
  setInterval(load_follows, 3000)
}

window.onload = load