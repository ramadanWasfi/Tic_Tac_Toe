const GameBoard = (function gameBoard() {
    const board = ["", "", "", "", "", "", "", "", ""];
    let disabled = false;

    const getMark = (position) => {
        return board[position];
    }

    const setDisabled = (state) => {
        disabled = state;
    }

    const getDisabled = () => disabled;

    const isBoardFull = () => {
        let isFull = true;
        for(let i = 0; i < board.length; i++) {
            if(board[i] === "") {
                isFull = false;
                break;
            }
        }
        return isFull;
    }
    const checkWinner = (position) => {
        let result = false;
        
        const winConditions = [
            [0,1,2], [0,3,6],
            [1,4,7], [2,5,8],
            [2,4,6], [3,4,5],
            [6,7,8], [0,4,8]
        ];

        for(let i = 0; i < 8; i++) {
            if(winConditions[i].includes(position)) {
                let cell1 = board[winConditions[i][0]];
                let cell2 = board[winConditions[i][1]];
                let cell3 = board[winConditions[i][2]];
                if((cell1 === cell2)  && (cell1 === cell3)) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }

    const changeMark = (position, newMark) => {
        if(board[position] === "") {
            board[position] = newMark;
        }
    }

    return { board, checkWinner, changeMark, setDisabled, getDisabled, isBoardFull};
})();

const Player = (name, mark) => {
    let turn = false;

    const changeTurn = (newState) => {
        turn = newState;
    }

    const getTurn = () => turn;

    const play = (position) => {
        GameBoard.changeMark(position, mark);
    }

    return { name, mark, changeTurn, play, getTurn}
}

const Player1 = Player("Ahmed", "X");
Player1.changeTurn(true);

const Player2 = Player("Ali", "O");
let currentPlayer = Player1.getTurn() ? Player1 : Player2;

const DisplayController = (function displayController() {
    const board = document.querySelector('#gameBoard');
    const gameState = document.querySelector('#gameState');
    const resetBtn = document.querySelector('#resetBtn');
    const boardCells = document.querySelectorAll('.boardCell');

    const renderBoard = (newBoard) => {
        let boardCells = board.children;
        for (let i = 0; i < 9; i++) {
            boardCells[i].textContent = GameBoard.board[i];
        }
    }

    const changeGameState = (newState) => {
        gameState.textContent = newState;
    }

    const resetGame = () => {
        for (let i = 0; i < 9; i++) {
            GameBoard.board[i] = ""; 
        }
        renderBoard(GameBoard.board);
    }

    const putMark = (e) => {
        //cell1 => get the last character "1" and subtract 1 then we get the position of item in array
        let position = e.target.id[e.target.id.length - 1] - 1; 
        if(GameBoard.board[position] !== '' || GameBoard.getDisabled())
            return;
        currentPlayer = Player1.getTurn() ? Player1 : Player2;
        if(currentPlayer.getTurn()) {
            currentPlayer.play(position);
        }
        
        if(currentPlayer === Player1) {
            Player1.changeTurn(false);
            Player2.changeTurn(true);
            changeGameState(`Player ${Player2.mark}'s turn`);

        } else {
            Player2.changeTurn(false);
            Player1.changeTurn(true);
            changeGameState(`Player ${Player1.mark}'s turn`);
        }
        renderBoard();
        if(GameBoard.checkWinner(position)) {
            changeGameState(`Player ${currentPlayer.mark} has won!`);
            GameBoard.setDisabled(true);
        } else {
            if(GameBoard.isBoardFull() && GameBoard.checkWinner(position) === false) {
                changeGameState(`It's a draw!`);
            }
        }
    }

    boardCells.forEach(cell => cell.addEventListener('click', (e) => {
        putMark(e);
    }))

    resetBtn.addEventListener('click', () => {
        resetGame();
        GameBoard.setDisabled(false);
        let currentPlayer = Player1.getTurn() ? Player1 : Player2;
        changeGameState(`Player ${currentPlayer.mark}'s turn`);
    });


    return {renderBoard, changeGameState, resetGame}
})();

DisplayController.renderBoard(GameBoard.board);

DisplayController.changeGameState(`Player ${currentPlayer.mark}'s turn`);