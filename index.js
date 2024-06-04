const canvas = document.getElementById('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 526

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: './img/background.png',
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imgSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'red',
    offset: {
        x: 205,
        y: 157
    },
    imgSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    sprites: {
        idle: {
            imgSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imgSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        },
        fall: {
            imgSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        takeHit: {
            imgSrc: './img/samuraiMack/Take Hit - white silhouette.png',
            framesMax: 4
        },
    },
    attackBox: {
        offset: {
            x: 167,
            y: 50,
        },
        width: 100,
        height: 50
    }
})

const enemy = new Fighter({
    position: {
        x: 800,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: 'green',
    offset: {
        x: 205,
        y: 170
    },
    imgSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    sprites: {
        idle: {
            imgSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imgSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imgSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        attack1: {
            imgSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        fall: {
            imgSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        takeHit: {
            imgSrc: './img/kenji/Take hit.png',
            framesMax: 3
        },
    },
    attackBox: {
        offset: {
            x: -160,
            y: 50
        },
        width: 100,
        height: 50
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

let lastKey

const speedMovement = 5


decreaseTimer()

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -speedMovement
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = speedMovement
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -speedMovement
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = speedMovement
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    if (rectangularCollision({
        rect1: player,
        rect2: enemy
    }) &&
        player.isAttacking &&
        player.frameCurrent === 4) {
        player.isAttacking = false
        enemy.takeHit()
        document.querySelector('#enemyHealth').style.width = `${enemy.health}%`
        console.log('collision')
    }

    if (player.isAttacking && player.frameCurrent === 4) {
        player.isAttacking = false
    }

    if (rectangularCollision({
        rect1: enemy,
        rect2: player
    }) &&
        enemy.isAttacking &&
        enemy.frameCurrent === 2) {
        enemy.isAttacking = false
        player.takeHit()
        document.querySelector('#playerHealth').style.width = `${player.health}%`
        console.log('collision')
    }

    if (enemy.isAttacking && player.frameCurrent === 1) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner(player, enemy, timerId)
    }
}
animate()

window.addEventListener('keydown', (event) => {
    console.log('event', event.key);
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break;
        case 'w':
            player.velocity.y = -20
            break;
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break;
        case ' ':
            player.attack()
            break;

        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowUp':
            enemy.velocity.y = -20
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowDown':
            enemy.attack()
            break;

    }
})

window.addEventListener('keyup', (event) => {
    console.log('keymap', keys)
    console.log('key up', event.key)
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})