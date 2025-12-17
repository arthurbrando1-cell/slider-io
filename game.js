/***** FIREBASE *****/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase, ref, set, onValue, onDisconnect, update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfdgkO3WzaxXT-djAA6MsLC2m26c9optU",
  authDomain: "slider-io.firebaseapp.com",
  databaseURL: "https://slider-io-default-rtdb.firebaseio.com",
  projectId: "slider-io",
  storageBucket: "slider-io.firebasestorage.app",
  messagingSenderId: "395647141464",
  appId: "1:395647141464:web:251cc58a3e0e90ca262c2d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/***** CANVAS *****/
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");
resize();
window.onresize = resize;

function resize(){
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

/***** GAME VARS *****/
let myId, mySnake;
let players = {};
let foods = [];
let angle = 0;
let boost = false;

/***** START *****/
window.startSliterz = function(nick){
  myId = Math.random().toString(36).substr(2,9);

  mySnake = {
    id: myId,
    nick,
    x: Math.random()*2000-1000,
    y: Math.random()*2000-1000,
    angle: 0,
    speed: 2,
    len: 20,
    parts: [],
    color: `hsl(${Math.random()*360},80%,60%)`
  };

  for(let i=0;i<mySnake.len;i++){
    mySnake.parts.push({x:mySnake.x-i*8,y:mySnake.y});
  }

  set(ref(db,"players/"+myId), mySnake);
  onDisconnect(ref(db,"players/"+myId)).remove();

  onValue(ref(db,"players"), snap=>{
    players = snap.val() || {};
  });

  spawnFood();
  loop();
};

/***** FOOD *****/
function spawnFood(){
  if(foods.length<300){
    foods.push({
      x:Math.random()*4000-2000,
      y:Math.random()*4000-2000,
      r:4,
      c:`hsl(${Math.random()*360},80%,60%)`
    });
  }
  requestAnimationFrame(spawnFood);
}

/***** INPUT *****/
canvas.onmousemove = e=>{
  angle = Math.atan2(e.clientY-innerHeight/2, e.clientX-innerWidth/2);
};

document.addEventListener("keydown",e=>{
  if(e.key==="c") boost=true;
});
document.addEventListener("keyup",e=>{
  if(e.key==="c") boost=false;
});

document.getElementById("boostBtn").ontouchstart=()=>boost=true;
document.getElementById("boostBtn").ontouchend=()=>boost=false;

/***** LOOP *****/
function loop(){
  updateSnake();
  draw();
  requestAnimationFrame(loop);
}

/***** UPDATE *****/
function updateSnake(){
  mySnake.angle = angle;
  const sp = boost?4:2;
  mySnake.x += Math.cos(angle)*sp;
  mySnake.y += Math.sin(angle)*sp;

  mySnake.parts.unshift({x:mySnake.x,y:mySnake.y});
  while(mySnake.parts.length>mySnake.len) mySnake.parts.pop();

  foods.forEach((f,i)=>{
    const dx=mySnake.x-f.x, dy=mySnake.y-f.y;
    if(Math.hypot(dx,dy)<10){
      foods.splice(i,1);
      mySnake.len+=2;
    }
  });

  update(ref(db,"players/"+myId),{
    x:mySnake.x,
    y:mySnake.y,
    angle:mySnake.angle,
    parts:mySnake.parts,
    len:mySnake.len
  });
}

/***** DRAW *****/
function draw(){
  ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.translate(canvas.width/2-mySnake.x, canvas.height/2-mySnake.y);

  // food
  foods.forEach(f=>{
    ctx.fillStyle=f.c;
    ctx.beginPath();
    ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
    ctx.fill();
  });

  // snakes
  Object.values(players).forEach(p=>{
    if(!p.parts) return;
    ctx.fillStyle=p.color||"#fff";
    p.parts.forEach((s,i)=>{
      ctx.beginPath();
      ctx.arc(s.x,s.y,i==0?7:6,0,Math.PI*2);
      ctx.fill();
    });
  });
}
