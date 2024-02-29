// Use a relative path for Socket.io connection
const socket = io('/');

let currentPlayerNumber;
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

// Tic Tac Toe game logic here

// Initialize Socket.io connection
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
    // Call checkWinner() here if needed
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

// Function to check for a winner (checkWinner) can be added here if not already included
