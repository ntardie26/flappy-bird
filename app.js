document.addEventListener('DOMContentLoaded' , () => {
    const bird = document.querySelector('.bird')
    const gameDisplay = document.querySelector('.game-container')
    const ground = document.querySelector('.ground-moving')
    
    let birdLeft = 220
    let birdBottom = 100
    let gravity = 1.8
    let isGameOver = false
    let gap = 430
    let score = 0
    let gameStarted = false

    const scoreDisplay = document.createElement('div')
    scoreDisplay.classList.add('score')
    scoreDisplay.innerHTML = score
    gameDisplay.appendChild(scoreDisplay)

    const startInstruction = document.createElement('div')
    startInstruction.classList.add('start-instruction')
    startInstruction.innerHTML = 'Press SPACE, ↑, W, or CLICK to start!'
    gameDisplay.appendChild(startInstruction)

    function startGame() {
        if (!gameStarted) return;
        birdBottom -= gravity
        bird.style.bottom = birdBottom + 'px'
        bird.style.left = birdLeft + 'px'
    }
    let gameTimerId = setInterval(startGame, 20)

    function control(e) {
        if (e.keyCode === 32 || e.keyCode === 38 || e.keyCode === 87) {
            e.preventDefault();
            jump()
        }
    }

    function handleClick(e) {
        e.preventDefault();
        jump();
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('touchstart', handleClick);

    function jump() {
        if (!gameStarted) {
            gameStarted = true;
            startInstruction.style.display = 'none';
            generateObstacle();
        }
        
        if (birdBottom < 520 && !isGameOver) {
            let jumpForce = 45;
            let jumpSteps = 6;
            let jumpIncrement = jumpForce / jumpSteps;
            let currentStep = 0;
            
            const jumpInterval = setInterval(() => {
                if (currentStep < jumpSteps && !isGameOver) {
                    birdBottom += jumpIncrement;
                    bird.style.bottom = birdBottom + 'px';
                    currentStep++;
                } else {
                    clearInterval(jumpInterval);
                }
            }, 12);
        }
    }

    document.addEventListener('keyup', control)


    function generateObstacle() {
        if (!gameStarted) return;
        
        let obstacleLeft = 460
        let randomHeight = Math.random() * 120 + 30
        let obstacleBottom = randomHeight
        const obstacle = document.createElement('div')
        const topObstacle = document.createElement('div')
        let scored = false
        
        if (!isGameOver) {
            obstacle.classList.add('obstacle')
            topObstacle.classList.add('topObstacle')
        }
        gameDisplay.appendChild(obstacle)
        gameDisplay.appendChild(topObstacle)
        obstacle.style.left = obstacleLeft + 'px'
        topObstacle.style.left = obstacleLeft + 'px'
        obstacle.style.bottom = obstacleBottom + 'px'
        topObstacle.style.bottom = obstacleBottom + gap + 'px'

        function moveObstacle() {
            if (isGameOver) return;
            
            obstacleLeft -= 2.5;
            obstacle.style.left = obstacleLeft + 'px'
            topObstacle.style.left = obstacleLeft + 'px'

            if (obstacleLeft === -60) {
                clearInterval(timerId)
                gameDisplay.removeChild(obstacle)
                gameDisplay.removeChild(topObstacle)
            }
            
            if (obstacleLeft <= 200 && obstacleLeft >= 195 && !scored) {
                score++
                scoreDisplay.innerHTML = score
                scored = true
                
                scoreDisplay.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    scoreDisplay.style.transform = 'scale(1)';
                }, 200);
            }
            
            if (
                obstacleLeft > 200 && obstacleLeft < 280 && birdLeft === 220 &&
                (birdBottom < obstacleBottom + 153 || birdBottom > obstacleBottom + gap -200)||
                birdBottom === 0 
                ) {
                gameOver()
                clearInterval(timerId)
            }
        }
        let timerId = setInterval(moveObstacle, 18)
        if (!isGameOver) setTimeout(generateObstacle, 2800)

    }


    function gameOver() {
        clearInterval(gameTimerId)
        console.log('game over')
        console.log('Final Score:', score)
        isGameOver = true
        document.removeEventListener('keyup', control)
        document.removeEventListener('click', handleClick)
        document.removeEventListener('touchstart', handleClick)
        ground.classList.add('ground')
        ground.classList.remove('ground-moving')
        
        const gameOverDisplay = document.createElement('div')
        gameOverDisplay.classList.add('game-over')
        gameOverDisplay.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 15px;">Game Over!</div>
            <div style="font-size: 24px; margin-bottom: 10px;">Final Score: ${score}</div>
            <div style="font-size: 18px; opacity: 0.8;">Press F5 to restart</div>
            <div style="font-size: 16px; opacity: 0.6; margin-top: 10px;">
                Controls: SPACE, ↑, W, or CLICK/TAP
            </div>
        `
        gameDisplay.appendChild(gameOverDisplay)
    }


})
