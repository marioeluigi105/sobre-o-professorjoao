window.onload = function() {
    let personagemEscolhido = null;
    let canvas, ctx, player, keys = {}, obstacles = [], coins = [];
    let score=0, level=1, lives=3, frameCount=0;

    const personagens = {
        gon:"green", killua:"white", kurapika:"yellow", leorio:"purple"
    };

    window.escolherPersonagem = function(nome){
        personagemEscolhido = nome;
        document.getElementById('selecionar-personagem').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        iniciarJogo();
    }

    function iniciarJogo(){
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');

        player = {
            x: 50,
            y: 300,
            width: 40,
            height: 60,
            color: personagens[personagemEscolhido],
            speed: 5
        };

        document.addEventListener('keydown', e => keys[e.code]=true);
        document.addEventListener('keyup', e => keys[e.code]=false);

        requestAnimationFrame(gameLoop);
    }

    function gameLoop(){
        frameCount++;
        ctx.clearRect(0,0,canvas.width,canvas.height);

        // Solo
        ctx.fillStyle="#654321";
        ctx.fillRect(0,360,canvas.width,40);

        // Movimento do jogador
        if(keys['ArrowUp']) player.y -= player.speed;
        if(keys['ArrowDown']) player.y += player.speed;
        if(keys['ArrowLeft']) player.x -= player.speed;
        if(keys['ArrowRight']) player.x += player.speed;

        // Limites do canvas
        if(player.x<0) player.x=0;
        if(player.y<0) player.y=0;
        if(player.x+player.width>canvas.width) player.x=canvas.width-player.width;
        if(player.y+player.height>canvas.height-40) player.y=canvas.height-40-player.height;

        // Desenhar jogador
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Obstáculos
        if(frameCount%120===0) obstacles.push({x:800,y:Math.random()*320,width:40,height:40});
        for(let i=obstacles.length-1;i>=0;i--){
            obstacles[i].x -= 5;
            ctx.fillStyle="red";
            ctx.fillRect(obstacles[i].x,obstacles[i].y,obstacles[i].width,obstacles[i].height);

            // Colisão
            if(player.x<obstacles[i].x+obstacles[i].width &&
               player.x+player.width>obstacles[i].x &&
               player.y<obstacles[i].y+obstacles[i].height &&
               player.y+player.height>obstacles[i].y){
                   obstacles.splice(i,1);
                   lives--; atualizarStatus();
                   if(lives<=0) return alert("Fim de jogo! Pontuação: "+score);
            }

            if(obstacles[i] && obstacles[i].x+obstacles[i].width<0) obstacles.splice(i,1);
        }

        // Moedas
        if(frameCount%80===0) coins.push({x:800,y:Math.random()*320,width:20,height:20});
        for(let i=coins.length-1;i>=0;i--){
            coins[i].x -= 5;
            ctx.fillStyle="yellow";
            ctx.beginPath();
            ctx.arc(coins[i].x+10,coins[i].y+10,10,0,Math.PI*2);
            ctx.fill();

            // Colisão com jogador
            if(player.x<coins[i].x+coins[i].width &&
               player.x+player.width>coins[i].x &&
               player.y<coins[i].y+coins[i].height &&
               player.y+player.height>coins[i].y){
                   coins.splice(i,1);
                   score+=10; atualizarStatus();
            }

            if(coins[i] && coins[i].x+coins[i].width<0) coins.splice(i,1);
        }

        level = Math.floor(score/500)+1;
        atualizarStatus();
        requestAnimationFrame(gameLoop);
    }

    function atualizarStatus(){
        document.getElementById('score').innerText = "Pontuação: "+score;
        document.getElementById('level').innerText = "Nível: "+level;
        document.getElementById('lives').innerText = "Vidas: "+lives;
    }
}
