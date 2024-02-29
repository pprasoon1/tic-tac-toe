const socket = io();

let currentPlayerNumber;
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

const resetGame = () => {
    enableBoxes();
    msgContainer.classList.add("hide");
    // Emit a reset event to inform the server to reset the game state
    socket.emit('reset-game');
};

socket.on('player-number', (number) => {
    currentPlayerNumber = number;
});

socket.on('update-players', (updatedPlayers) => {
    console.log(updatedPlayers);  // Log the updated player list
});

socket.on('update', (data) => {
    const { boxIndex, value } = data;
    boxes[boxIndex].innerText = value;
    boxes[boxIndex].disabled = true;
    checkWinner();
});

socket.on('reset', () => {
    resetGame();  // Reset the game when the server sends a reset event
});

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (box.innerText === "" && currentPlayerNumber !== undefined) {
            const value = currentPlayerNumber === 0 ? "0" : "X";
            box.innerText = value;
            box.disabled = true;
            // Emit move event with player information
            socket.emit('move', { boxIndex: index, value });
        }
    });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winner) => {
    msg.innerText = `Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

function checkWinner() {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                showWinner(pos1Val);
            }
        }
    }
};
