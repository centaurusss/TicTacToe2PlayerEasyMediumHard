const container = document.querySelector(".container");
const gridButton = document.getElementById("submit-grid");
const clearGridButton = document.getElementById("clear-grid");
const gridWidth = document.getElementById("width-range");
const gridHeight = document.getElementById("height-range");
const colorButton = document.getElementById("color-input");
const eraseBtn = document.getElementById("erase-btn");
const paintBtn = document.getElementById("paint-btn");
const widthValue = document.getElementById("width-value");
const heightValue = document.getElementById("height-value");

let draw = false;
let erase = false;

function createGrid() {
  container.innerHTML = "";
  container.style.gridTemplateColumns = `repeat(${gridWidth.value}, 20px)`;
  container.style.gridTemplateRows = `repeat(${gridHeight.value}, 20px)`;

  for (let i = 0; i < gridHeight.value * gridWidth.value; i++) {
    let cell = document.createElement("div");
    cell.classList.add("gridCol");

    cell.addEventListener("mousedown", () => {
      draw = true;
      cell.style.backgroundColor = erase ? "#fff" : colorButton.value;
    });

    cell.addEventListener("mousemove", () => {
      if (draw) {
        cell.style.backgroundColor = erase ? "#fff" : colorButton.value;
      }
    });

    cell.addEventListener("mouseup", () => {
      draw = false;
    });

    container.appendChild(cell);
  }
}

gridButton.addEventListener("click", createGrid);
clearGridButton.addEventListener("click", () => {
  container.innerHTML = "";
});

eraseBtn.addEventListener("click", () => {
  erase = true;
  eraseBtn.style.background = "#e67e22";
  paintBtn.style.background = "#ff4757";
});

paintBtn.addEventListener("click", () => {
  erase = false;
  paintBtn.style.background = "#e67e22";
  eraseBtn.style.background = "#ff4757";
});

gridWidth.addEventListener("input", () => {
  widthValue.textContent = gridWidth.value;
});

gridHeight.addEventListener("input", () => {
  heightValue.textContent = gridHeight.value;
});

// initialize default grid
window.onload = () => {
  createGrid();
  widthValue.textContent = gridWidth.value;
  heightValue.textContent = gridHeight.value;
};
