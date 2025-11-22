let personagemEscolhido = null;

function escolherPersonagem(nome) {
    personagemEscolhido = nome;
    document.getElementById('selecionar-personagem').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    iniciarJogo();
}

// ---------------- JOGO ----------------
let canvas, ctx;
let player, keys = {}, gravity = 1;
let obstacles = [], coins = [];
let score = 0, level = 1, lives = 3;
let frameCount = 0;

function iniciarJogo() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Jogador
    player = {
        x: 50,
        y: 300,
        width: 40,
        height: 60,
        dy: 0,
        jumpPower: -15
    };

    document.addEventListener('keydown', e => keys[e.code] = true);
    document.addEventListener('keyup', e => keys[e.code] = false);

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    frameCount++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Solo
    ctx.fillStyle = "#654321";
    ctx.fillRect(0, 360, canvas.width, 40);

    // Jogador
    if(keys['Space'] && player.y >= 300) player.dy = player.jumpPower;
    player.dy += gravity;
    player.y += player.dy;
    if(player.y > 300) { player.y = 300; player.dy = 0; }

    // Desenhar personagem (simples retângulo, depois pode trocar por sprite)
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Obstáculos
    if(frameCount % 120 === 0) {
        obstacles.push({x: 800, y: 320, width: 40, height: 40});
    }

    for(let i = obstacles.length-1; i>=0; i--){
        obstacles[i].x -= 5;
        ctx.fillStyle = "red";
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

        // Colisão
        if(player.x < obstacles[i].x + obstacles[i].width &&
           player.x + player.width > obstacles[i].x &&
           player.y < obstacles[i].y + obstacles[i].height &&
           player.y + player.height > obstacles[i].y){
               obstacles.splice(i,1);
               lives--;
               atualizarStatus();
               if(lives <=0) return alert("Fim de jogo! Pontuação: " + score);
        }

        if(obstacles[i] && obstacles[i].x + obstacles[i].width < 0) obstacles.splice(i,1);
    }

    // Moedas
    if(frameCount % 80 === 0) {
        coins.push({x: 800, y: Math.random()*200+100, width: 20, height: 20});
    }

    for(let i = coins.length-1; i>=0; i--){
        coins[i].x -= 5;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(coins[i].x+10, coins[i].y+10, 10, 0, Math.PI*2);
        ctx.fill();

        // Colisão jogador
        if(player.x < coins[i].x + coins[i].width &&
           player.x + player.width > coins[i].x &&
           player.y < coins[i].y + coins[i].height &&
           player.y + player.height > coins[i].y){
               coins.splice(i,1);
               score += 10;
               atualizarStatus();
        }

        if(coins[i] && coins[i].x + coins[i].width < 0) coins.splice(i,1);
    }

    // Nível aumenta a cada 500 pontos
    level = Math.floor(score / 500) + 1;
    atualizarStatus();

    requestAnimationFrame(gameLoop);
}

function atualizarStatus(){
    document.getElementById('score').innerText = "Pontuação: " + score;
    document.getElementById('level').innerText = "Nível: " + level;
    document.getElementById('lives').innerText = "Vidas: " + lives;
}
