const gridContainer = document.getElementById('grid-container');
const startButton = document.getElementById('start-dfs-button');
const resetButton = document.getElementById('reset-button');
const resetPathButton = document.getElementById('reset-path-button');
const startDijkstraButton = document.getElementById('start-dijkstra-button');
const startAStarButton = document.getElementById('start-astar-button'); // New A* button

const numRows = 20;
const numCols = 20;
let grid = [];
let start = null;
let target = null;
let isMousePressed = false;
let isDraggingWall = false;
let isDFSRunning = false;
let isDijkstraRunning = false;
let isAStarRunning = false;
let path = [];

// Create the grid
function createGrid() {
  grid = [];
  for (let row = 0; row < numRows; row++) {
    const rowArr = [];
    for (let col = 0; col < numCols; col++) {
      const cell = document.createElement('div');
      cell.classList.add('grid-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', onCellClick);
      cell.addEventListener('mouseover', onCellMouseOver);
      gridContainer.appendChild(cell);
      rowArr.push(cell);
    }
    grid.push(rowArr);
  }
}

// Handle cell click (for start, target, or walls)
function onCellClick(event) {
  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (!start) {
    start = { row, col };
    cell.classList.add('start');
  } else if (!target) {
    target = { row, col };
    cell.classList.add('target');
  } else {
    if (cell.classList.contains('start')) {
      start = null;
      cell.classList.remove('start');
    } else if (cell.classList.contains('target')) {
      target = null;
      cell.classList.remove('target');
    } else {
      cell.classList.toggle('wall');
    }
  }
}

// Handle mouse dragging to place walls
function onCellMouseOver(event) {
  if (isMousePressed && isDraggingWall) {
    const cell = event.target;
    // Only place walls if it's not a start or target cell
    if (!cell.classList.contains('start') && !cell.classList.contains('target')) {
      cell.classList.add('wall');
    }
  }
}

// Mouse events for dragging walls
document.addEventListener('mousedown', () => {
  isMousePressed = true;
  isDraggingWall = true;  // Enable wall dragging
});

document.addEventListener('mouseup', () => {
  isMousePressed = false;
  isDraggingWall = false;  // Disable wall dragging
});

// Reset grid and the DFS state
resetButton.addEventListener('click', () => {
  gridContainer.innerHTML = '';
  createGrid();
  start = null;
  target = null;
  isDFSRunning = false;
  isDijkstraRunning = false;
  isAStarRunning = false;
  path = [];
});

// Reset path and visited cells only, keeping start, target, and walls intact
resetPathButton.addEventListener('click', () => {
  // Reset all path and visited cells
  const allCells = document.querySelectorAll('.grid-cell');
  allCells.forEach(cell => {
    if (cell.classList.contains('visited') || cell.classList.contains('path')) {
      cell.classList.remove('visited', 'path');
    }
  });
  isDFSRunning = false;
  isDijkstraRunning = false;
  isAStarRunning = false;
  path = [];
});

// Helper to handle cell validity for Dijkstra and A*
function isValid(cell) {
  return (
    cell.row >= 0 &&
    cell.row < numRows &&
    cell.col >= 0 &&
    cell.col < numCols &&
    !grid[cell.row][cell.col].classList.contains('wall')
  );
}

// A* Algorithm for pathfinding
function aStar() {
  if (!start || !target) {
    alert('Please set both start and target points!');
    return;
  }

  const gScore = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  const fScore = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  const parent = Array.from({ length: numRows }, () => Array(numCols).fill(null));

  gScore[start.row][start.col] = 0;
  fScore[start.row][start.col] = heuristic(start, target);

  // Min-heap priority queue for A* algorithm
  const openList = [{ row: start.row, col: start.col, f: fScore[start.row][start.col] }];

  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  // Heuristic function (Manhattan distance)
  function heuristic(cell, target) {
    return Math.abs(cell.row - target.row) + Math.abs(cell.col - target.col);
  }

  function explore() {
    if (openList.length === 0) {
      alert('No path found!');
      return;
    }

    // Sort the open list by fScore
    openList.sort((a, b) => a.f - b.f);
    const current = openList.shift();
    const { row, col } = current;
    const currentCell = grid[row][col];

    if (visited[row][col]) {
      return;
    }

    visited[row][col] = true;
    currentCell.classList.add('visited');

    if (row === target.row && col === target.col) {
      let temp = parent[row][col];
      while (temp) {
        const pathCell = grid[temp.row][temp.col];
        pathCell.classList.add('path');
        temp = parent[temp.row][temp.col];
      }
      isAStarRunning = false;
      return;
    }

    // Explore neighbors
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (isValid({ row: newRow, col: newCol }) && !visited[newRow][newCol]) {
        const tentativeGScore = gScore[row][col] + 1;
        if (tentativeGScore < gScore[newRow][newCol]) {
          parent[newRow][newCol] = { row, col };
          gScore[newRow][newCol] = tentativeGScore;
          fScore[newRow][newCol] = gScore[newRow][newCol] + heuristic({ row: newRow, col: newCol }, target);
          openList.push({ row: newRow, col: newCol, f: fScore[newRow][newCol] });
        }
      }
    }

    setTimeout(explore, 50);  // Make it asynchronous for visual effect
  }

  explore();
}

startAStarButton.addEventListener('click', () => {
  if (!isAStarRunning) {
    isAStarRunning = true;
    aStar();
  }
});


// Helper to handle cell validity for Dijkstra (not a wall)
function isValidDijkstra(cell) {
  return (
    cell.row >= 0 &&
    cell.row < numRows &&
    cell.col >= 0 &&
    cell.col < numCols &&
    !grid[cell.row][cell.col].classList.contains('wall')
  );
}

// Dijkstra's Algorithm for pathfinding
function dijkstra() {
  if (!start || !target) {
    alert('Please set both start and target points!');
    return;
  }

  const distance = Array.from({ length: numRows }, () => Array(numCols).fill(Infinity));
  const visited = Array.from({ length: numRows }, () => Array(numCols).fill(false));
  const parent = Array.from({ length: numRows }, () => Array(numCols).fill(null));

  distance[start.row][start.col] = 0;

  // Min-heap priority queue for Dijkstra's algorithm
  const priorityQueue = [{ row: start.row, col: start.col, dist: 0 }];
  
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];

  function explore() {
    if (priorityQueue.length === 0) {
      alert('No path found!');
      return;
    }

    // Extract the cell with the smallest distance from the queue
    priorityQueue.sort((a, b) => a.dist - b.dist);
    const current = priorityQueue.shift();
    const { row, col, dist } = current;
    const currentCell = grid[row][col];

    if (visited[row][col]) {
      return;
    }

    visited[row][col] = true;
    currentCell.classList.add('visited');

    if (row === target.row && col === target.col) {
      let temp = parent[row][col];
      while (temp) {
        const pathCell = grid[temp.row][temp.col];
        pathCell.classList.add('path');
        temp = parent[temp.row][temp.col];
      }
      isDijkstraRunning = false;
      return;
    }

    // Explore neighbors
    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;
      if (isValidDijkstra({ row: newRow, col: newCol }) && !visited[newRow][newCol]) {
        const newDist = dist + 1;
        if (newDist < distance[newRow][newCol]) {
          distance[newRow][newCol] = newDist;
          parent[newRow][newCol] = { row, col };
          priorityQueue.push({ row: newRow, col: newCol, dist: newDist });
        }
      }
    }

    setTimeout(explore, 50);  // Make it asynchronous for visual effect
  }

  explore();
}

startDijkstraButton.addEventListener('click', () => {
  if (!isDijkstraRunning) {
    isDijkstraRunning = true;
    dijkstra();
  }
});


// DFS algorithm for pathfinding
function dfs() {
  if (!start || !target) {
    alert('Please set both start and target points!');
    return;
  }

  let stack = [start];
  let visited = new Set();
  let current = start;

  function explore() {
    if (stack.length === 0) {
      alert('No path found!');
      return;
    }

    current = stack.pop();
    const currentCell = grid[current.row][current.col];

    if (!currentCell.classList.contains('visited')) {
      currentCell.classList.add('visited');
    }

    if (current.row === target.row && current.col === target.col) {
      let temp = current;
      while (temp) {
        const pathCell = grid[temp.row][temp.col];
        pathCell.classList.add('path');
        temp = temp.prev;
      }
      isDFSRunning = false;
      return;
    }

    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], 
    ];
    for (const [dx, dy] of directions) {
      const newRow = current.row + dx;
      const newCol = current.col + dy;

      if (isValid({ row: newRow, col: newCol }, visited)) {
        visited.add(`${newRow},${newCol}`);
        stack.push({ row: newRow, col: newCol, prev: current });
      }
    }

    setTimeout(explore, 50);  
  }

  function isValid(cell, visited) {
    return (
      cell.row >= 0 &&
      cell.row < numRows &&
      cell.col >= 0 &&
      cell.col < numCols &&
      !visited.has(`${cell.row},${cell.col}`) &&
      !grid[cell.row][cell.col].classList.contains('wall')
    );
  }

  explore();
}

startButton.addEventListener('click', () => {
  if (!isDFSRunning) {
    isDFSRunning = true;
    dfs();
  }
});


createGrid();