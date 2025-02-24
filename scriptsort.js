const canvas = document.getElementById('sortingCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

let list = [];
let sorting = false;
let ascending = true;
let currentAlgorithm = null;
let animationFrameId = null;
let numBars = 100; // Default number of bars
let barWidth = Math.floor(width / numBars);  // Dynamically set the bar width based on numBars
const minValue = 0;
const maxValue = 100;
const barHeightScale = height / (maxValue - minValue);

// Initialize the list
function generateStartingList() {
  list = [];
  for (let i = 0; i < numBars; i++) {
    list.push(Math.floor(Math.random() * (maxValue - minValue) + minValue));
  }
  // Recalculate barWidth after generating the list
  barWidth = width / numBars;
}

// Draw the list
function drawList(colorPositions = {}) {
  ctx.clearRect(0, 0, width, height);
  for (let i = 0; i < list.length; i++) {
    const x = i * barWidth;
    const y = height - list[i] * barHeightScale;
    const barHeight = list[i] * barHeightScale;
    
    let color = 'rgb(128, 128, 128)';
    if (colorPositions[i]) {
      color = colorPositions[i];
    }

    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth - 1, barHeight);
  }
}

// Insertion Sort Algorithm
function* insertionSort() {
  document.getElementById('algorithmName').textContent = "Current Algorithm: Insertion Sort";
  for (let i = 1; i < list.length; i++) {
    let key = list[i];
    let j = i - 1;
    while (j >= 0 && (ascending ? list[j] > key : list[j] < key)) {
      list[j + 1] = list[j];
      j--;
      drawList({ [j + 1]: 'green', [i]: 'red' });
      yield true;
    }
    list[j + 1] = key;
    drawList({ [j + 1]: 'green', [i]: 'red' });
    yield true;
  }
  sorting = false;
}

// Bubble Sort Algorithm
function* bubbleSort() {
  document.getElementById('algorithmName').textContent = "Current Algorithm: Bubble Sort";
  let swapped;
  for (let i = 0; i < list.length; i++) {
    swapped = false;
    for (let j = 0; j < list.length - 1 - i; j++) {
      if ((ascending ? list[j] > list[j + 1] : list[j] < list[j + 1])) {
        [list[j], list[j + 1]] = [list[j + 1], list[j]];
        swapped = true;
        drawList({ [j]: 'green', [j + 1]: 'red' });
        yield true;
      }
    }
    if (!swapped) break;
  }
  sorting = false;
}

// Quick Sort Algorithm
function* quickSort(low = 0, high = list.length - 1) {
  document.getElementById('algorithmName').textContent = "Current Algorithm: Quick Sort";
  if (low < high) {
    const pivot = yield* partition(low, high);
    yield* quickSort(low, pivot - 1);
    yield* quickSort(pivot + 1, high);
  } else {
    sorting = false;
  }
}

// Partition for Quick Sort
function* partition(low, high) {
  const pivot = list[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if ((ascending ? list[j] < pivot : list[j] > pivot)) {
      i++;
      [list[i], list[j]] = [list[j], list[i]];
      drawList({ [i]: 'green', [j]: 'red', [high]: 'black' });
      yield true;
    }
  }
  [list[i + 1], list[high]] = [list[high], list[i + 1]];
  return i + 1;
}

// Merge Sort Algorithm
function* mergeSort(low = 0, high = list.length - 1) {
  document.getElementById('algorithmName').textContent = "Current Algorithm: Merge Sort";
  if (low < high) {
    const mid = Math.floor((low + high) / 2);
    yield* mergeSort(low, mid);
    yield* mergeSort(mid + 1, high);
    yield* merge(low, mid, high);
  } else {
    sorting = false;
  }
}

// Merge for Merge Sort
function* merge(low, mid, high) {
  const left = list.slice(low, mid + 1);
  const right = list.slice(mid + 1, high + 1);
  left.push(Infinity);
  right.push(Infinity);
  let i = 0, j = 0;

  for (let k = low; k <= high; k++) {
    if (left[i] <= right[j]) {
      list[k] = left[i];
      i++;
    } else {
      list[k] = right[j];
      j++;
    }
    drawList({ [k]: 'green' });
    yield true;
  }
}

// Handle User Inputs
document.getElementById('startBtn').addEventListener('click', () => {
  if (!sorting && currentAlgorithm !== null) {
    sorting = true;
    requestAnimationFrame(runSorting);
  }
});

document.getElementById('resetBtn').addEventListener('click', () => {
  sorting = false;
  generateStartingList();
  drawList();
});

document.getElementById('insertionSortBtn').addEventListener('click', () => {
  if (!sorting) {
    currentAlgorithm = insertionSort();
    document.getElementById('algorithmName').textContent = "Current Algorithm: Insertion Sort";
    sorting = true;
    requestAnimationFrame(runSorting);
    document.getElementById('startBtn').disabled = false;
  }
});

document.getElementById('bubbleSortBtn').addEventListener('click', () => {
  if (!sorting) {
    currentAlgorithm = bubbleSort();
    document.getElementById('algorithmName').textContent = "Current Algorithm: Bubble Sort";
    sorting = true;
    requestAnimationFrame(runSorting);
    document.getElementById('startBtn').disabled = false;
  }
});

document.getElementById('quickSortBtn').addEventListener('click', () => {
  if (!sorting) {
    currentAlgorithm = quickSort();
    document.getElementById('algorithmName').textContent = "Current Algorithm: Quick Sort";
    sorting = true;
    requestAnimationFrame(runSorting);
    document.getElementById('startBtn').disabled = false;
  }
});

document.getElementById('mergeSortBtn').addEventListener('click', () => {
  if (!sorting) {
    currentAlgorithm = mergeSort();
    document.getElementById('algorithmName').textContent = "Current Algorithm: Merge Sort";
    sorting = true;
    requestAnimationFrame(runSorting);
    document.getElementById('startBtn').disabled = false;
  }
});

document.getElementById('toggleDirectionBtn').addEventListener('click', () => {
  ascending = !ascending;
  alert(`Sorting Order: ${ascending ? 'Ascending' : 'Descending'}`);
});

// Update Number of Bars Dynamically
document.getElementById('updateBarsBtn').addEventListener('click', () => {
  numBars = parseInt(document.getElementById('numBars').value, 10);
  generateStartingList();
  drawList();
});

// Run the Sorting Algorithm
function runSorting() {
  if (sorting) {
    if (currentAlgorithm.next().done) {
      sorting = false;
    } else {
      requestAnimationFrame(runSorting);
    }
  }
}

// Initialize the list
generateStartingList();
drawList();
