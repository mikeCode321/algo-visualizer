let startSet = false; 
let targetSet = false; 
let isDragging = false; 

function createGrid(rows, cols) {
  const gridContainer = document.getElementById('grid-container');
  gridContainer.innerHTML = ''; 

  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`; 
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`; 

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const gridCell = document.createElement('div');
      gridCell.classList.add('grid-cell');
      gridCell.setAttribute('data-row', i);
      gridCell.setAttribute('data-col', j);

      gridCell.addEventListener('click', function () {
        handleClick(gridCell);
      });

      gridCell.addEventListener('mousedown', function () {
        isDragging = true; 
        handleClick(gridCell); 
      });

      gridCell.addEventListener('mouseenter', function () {
        if (isDragging) {
          handleClick(gridCell); 
        }
      });

      gridCell.addEventListener('mouseup', function () {
        isDragging = false;
      });

      gridContainer.appendChild(gridCell);
    }
  }
}

function handleClick(cell) {
  if (!startSet) {
    cell.classList.add('start');
    startSet = true;
    document.getElementById('mode-label').textContent = 'Current Mode: Target'; 
  }
  
  else if (!targetSet && !cell.classList.contains('start')) {
    cell.classList.add('target');
    targetSet = true;
    document.getElementById('mode-label').textContent = 'Current Mode: Blocked (Walls)'; 
  }
  
  else if (!cell.classList.contains('start') && !cell.classList.contains('target')) {
    cell.classList.add('blocked');
  }
}

function resetGrid() {
  const gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.classList.remove('blocked', 'start', 'target', 'visited','path');
  });
  startSet = false; 
  targetSet = false; 
  document.getElementById('mode-label').textContent = 'Current Mode: Start'; 
}

function resetPath() {
  const gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach(cell => {
    cell.classList.remove('visited','path');
  });
  document.getElementById('mode-label').textContent = 'Current Mode: Blocked (Walls)'; 
}

document.addEventListener('DOMContentLoaded', function () {
  createGrid(15, 15);
});

function getNeighbors(cell, rows, cols) {
  const neighbors = [];
  const row = parseInt(cell.getAttribute('data-row'));
  const col = parseInt(cell.getAttribute('data-col'));

  const directions = [
    { row: 1, col: 0 }, 
    { row: 0, col: -1 }, 
    { row: -1, col: 0 },
    { row: 0, col: 1 }, 
  ];

  directions.forEach(direction => {
    const newRow = row + direction.row;
    const newCol = col + direction.col;

    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      const neighbor = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
      if (neighbor) neighbors.push(neighbor);
    }
  });

  return neighbors;
}

function backtrackPath(targetCell, parents) {
  let currentCell = targetCell;

  while (currentCell) {
    if (!currentCell.classList.contains('start') && !currentCell.classList.contains('target')) {
        currentCell.classList.add('path');
     }
    currentCell = parents.get(currentCell);
  }
}

function bfs() {
  let rows = 15;
  let cols = 15;
  const startCell = document.querySelector('.start');
  const targetCell = document.querySelector('.target');
  const queue = [startCell];
  const visited = new Set();
  const parents = new Map();

  visited.add(startCell);

  const animateBFS = () => {
    if (queue.length === 0) {
      return;
    }

    const currentCell = queue.shift(); 

    if (!currentCell.classList.contains('start') && !currentCell.classList.contains('target')) {
        currentCell.classList.add('visited'); 
    }

    if (currentCell === targetCell) {
      backtrackPath(targetCell, parents);
      return;
    }
    
    const neighbors = getNeighbors(currentCell, rows, cols);

    neighbors.forEach(neighbor => {
      if (!neighbor.classList.contains('blocked') && !visited.has(neighbor)) {
        visited.add(neighbor);
        parents.set(neighbor, currentCell); 
        queue.push(neighbor); 
      }
    });

    if (queue.length > 0) {
      requestAnimationFrame(animateBFS);
    }
  };

  animateBFS();
}

function dfs() {
  let rows = 15;
  let cols = 15;
  const startCell = document.querySelector('.start');
  const targetCell = document.querySelector('.target');
  const stack = [startCell];
  const visited = new Set();
  const parents = new Map();

  visited.add(startCell);

  const animateDFS = () => {
    if (stack.length === 0) {
      return;
    }

    const currentCell = stack.pop(); 

    if (!currentCell.classList.contains('start') && !currentCell.classList.contains('target')) {
        currentCell.classList.add('visited'); 
    }

    if (currentCell === targetCell) {
      backtrackPath(targetCell, parents);
      return;
    }
    
    const neighbors = getNeighbors(currentCell, rows, cols);

    neighbors.forEach(neighbor => {
      if (!neighbor.classList.contains('blocked') && !visited.has(neighbor)) {
        visited.add(neighbor);
        parents.set(neighbor, currentCell); 
        stack.push(neighbor); 
      }
    });

    if (stack.length > 0) {
      requestAnimationFrame(animateDFS);
    }
  };

  animateDFS();
}

function heuristic(cell, targetCell) {
    const cellRow = parseInt(cell.getAttribute('data-row'));
    const cellCol = parseInt(cell.getAttribute('data-col'));
    const targetRow = parseInt(targetCell.getAttribute('data-row'));
    const targetCol = parseInt(targetCell.getAttribute('data-col'));
    
    return Math.abs(cellRow - targetRow) + Math.abs(cellCol - targetCol);
}

function astar(){
    let rows = 15;
    let cols = 15;
    const startCell = document.querySelector('.start');
    const targetCell = document.querySelector('.target');
    const openSet = [startCell];
    const closedSet = new Set();
    const parents = new Map();
    const gScore = new Map();
    const fScore = new Map();
    
    gScore.set(startCell, 0);
    fScore.set(startCell, heuristic(startCell, targetCell));
    
    const animateAStar = () => {
        if (openSet.length === 0) {
        return;
        }
    
        openSet.sort((a, b) => fScore.get(a) - fScore.get(b));
        const currentCell = openSet.shift(); 
    
        if (!currentCell.classList.contains('start') && !currentCell.classList.contains('target')) {
            currentCell.classList.add('visited'); 
        }
    
        if (currentCell === targetCell) {
            backtrackPath(targetCell, parents);
            return;
        }
    
        closedSet.add(currentCell);
        
        const neighbors = getNeighbors(currentCell, rows, cols);
    
        neighbors.forEach(neighbor => {
            if (neighbor.classList.contains('blocked') || closedSet.has(neighbor)) {
                return;
            }
        
            const tentativeGScore = gScore.get(currentCell) + 1;
        
            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
            } else if (tentativeGScore >= gScore.get(neighbor)) {
                return;
            }
        
            parents.set(neighbor, currentCell);
            gScore.set(neighbor, tentativeGScore);
            fScore.set(neighbor, gScore.get(neighbor) + heuristic(neighbor, targetCell));
        });
    
        if (openSet.length > 0) {
            requestAnimationFrame(animateAStar);
        }
    };
    
    animateAStar();
}