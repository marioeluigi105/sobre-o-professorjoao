let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

let gon = {x:50, y:200, vy:0};
let chao = 250;
let moedas = [];
let obst = [];
let score = 0;

function spawnMoeda(){
    moedas.push({x:600, y: Math.random()*200});
}
function spawnObst(){
    obst.push({x:600, y:220});
}

setInterval(spawnMoeda, 1000);
setInterval(spawnObst, 1500);

function loop(){
    ctx.clearRect(0,0,600,300);

    gon.y += gon.vy;
    gon.vy += 1;
    if(gon.y > chao){ gon.y = chao; }

    ctx.fillStyle="yellow";
    moedas.forEach(m=>{
        m.x-=4;
        ctx.beginPath();
        ctx.arc(m.x,m.y,10,0,Math.PI*2);
        ctx.fill();

        if(Math.abs(m.x-gon.x)<20 && Math.abs(m.y-gon.y)<20){
            score+=100;
            m.x=-999;
        }
    });

    ctx.fillStyle="red";
    obst.forEach(o=>{
        o.x-=6;
        ctx.fillRect(o.x,o.y,20,30);

        if(Math.abs(o.x-gon.x)<20 && gon.y>200){
            alert("Você bateu! Pontos: "+score);
            document.location.reload();
        }
    });

    ctx.fillStyle="white";
    ctx.fillRect(gon.x, gon.y, 20, 20);

    ctx.fillText("Score: "+score, 10,20);

    if(score >= 500){
        ctx.fillText("LEVEL UP!", 260,20);
    }

    requestAnimationFrame(loop);
}
loop();

document.addEventListener("keydown", ()=>{ 
    if(gon.y >= chao) gon.vy = -18;
});
