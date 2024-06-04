
function rectangularCollision({ rect1, rect2 }) {
    return rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height
}

function determineWinner(player, enemy, timeId) {
    clearTimeout(timeId)
    document.querySelector('#result').style.display = 'flex'
    let result = ''
    if (player.health === enemy.health) {
        result = 'Draw'
    } else if (player.health > enemy.health) {
        result = 'Player 1 win'
    } else {
        result = 'Player 2 win'
    }
    document.querySelector('#result').innerHTML = result
}

let timer = 60
let timerId
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    } else {
        determineWinner(player, enemy, timerId)
    }
}