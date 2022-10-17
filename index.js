const GameBoard = (function gameBoard() {
    const board = new Array(9);
    for (let i = 0; i < 9; i++) {
        board[i] = 's'; 
    }
    return { board };
})();

const Player = (name, mark) => {
    const turn = false;
    return { name, mark, turn }
}

const DisplayController = (function displayController() {
    const board = document.querySelector('#gameBoard');

    const renderBoard = (newBoard) => {
        let boardCells = board.children;
        for (let i = 0; i < 9; i++) {
            boardCells[i].textContent = GameBoard.board[i];
        }
    }

    return {renderBoard}
})();

DisplayController.renderBoard(GameBoard.board);