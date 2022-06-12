document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  const width = 10;
  const bombAmount = 15;
  let flag = 0;
  let isGameOver = false;
  let squares = [];
  //create Board
  function createBoard() {
    flagLeft.innerHTML = bombAmount;
    //get shuffled game array with random bombs
    const bombArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //normal click
      square.addEventListener("click", function (e) {
        click(square);
      });
      square.addEventListener("contextmenu", function (e) {
        e.preventDefault();
        addFlag(square);
      });
    }

    //add numbers
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;
      if (squares[i].classList.contains("valid")) {
        if (!isLeftEdge && squares[i - 1].classList.contains("bomb")) total++; //check Left edge
        if (
          i > 9 &&
          !isRightEdge &&
          squares[i + 1 - width].classList.contains("bomb")
        )
          total++; // check right upper edge
        if (i > 9 && squares[i - width].classList.contains("bomb")) total++; //check top upper edge
        if (
          i > 10 &&
          !isLeftEdge &&
          squares[i - 1 - width].classList.contains("bomb")
        )
          total++; //check left upper edge
        if (!isRightEdge && squares[i + 1].classList.contains("bomb")) total++; //check right edge
        if (
          i < 90 &&
          !isLeftEdge &&
          squares[i - 1 + width].classList.contains("bomb")
        )
          total++; //check left lower edge
        if (
          i < 89 &&
          !isRightEdge &&
          squares[i + 1 + width].classList.contains("bomb")
        )
          total++; //check right lower edge
        if (i < 90 && squares[i + width].classList.contains("bomb")) total++; //check  lower edge
        squares[i].setAttribute("data", total);
      }
    }
  }
  createBoard();

  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flag < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = "🚩";
        flag++;
        flagLeft.innerHTML = bombAmount - flag;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flag--;
        flagLeft.innerHTML = bombAmount - flag;
      }
    }
  }
  function click(square) {
    const currentId = +square.id;
    if (isGameOver) return;
    if (
      square.classList.contains("checked") ||
      square.classList.contains("falg")
    )
      return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = +square.getAttribute("data");
      if (total !== 0) {
        square.innerHTML = total;
        square.classList.add("checked");
        if (total == 1) square.classList.add("one");
        if (total == 2) square.classList.add("two");
        if (total == 3) square.classList.add("three");
        if (total == 4) square.classList.add("four");
        return;
      }
      checkSquare(square, currentId);
    }
    square.classList.add("checked");
  }

  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (!isLeftEdge) {
        const newId = squares[currentId - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[currentId + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId > 9) {
        const newId = squares[currentId - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 10 && !isLeftEdge) {
        const newId = squares[currentId - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (!isRightEdge) {
        const newId = squares[currentId + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }

      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[currentId - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89 && !isRightEdge) {
        const newId = squares[currentId + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90) {
        const newId = squares[currentId + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //game over
  function gameOver(square) {
    result.innerHTML = "Game Over!";
    isGameOver = true;

    //show all bombs
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
      }
      square.classList.add("checked");
    });
  }

  function checkForWin() {
    let matches = 0;
    for (let i = 0; i < squares.length; i++) {
      if (
        squares[i].classList.contains("flag") &&
        squares[i].classList.contains("bomb")
      ) {
        matches++;
      }
    }
    if (matches === bombAmount) {
      squares.forEach((square) => {
        square.classList.add("checked");
      });
      result.innerHTML = "YOU WIN!";
      isGameOver = true;
    }
  }
});

////////////////////////////////////////
//COMPLETED
