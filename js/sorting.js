
let algoName = "None"
let isAnimating = true;
let isAscending = true; 
let speed = 100;

function generateRandomArray(numBars = 100) {
  const arr = [];
  for (let i = 0; i < numBars; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1);  
  }
  return arr;
}

function updateBarState(bar, state) {
    bar.classList.remove('current', 'compared', 'swapped');
    bar.classList.add(state);
}

function clearAllBarState(){
    document.querySelectorAll('.bar').forEach(bar => {
        bar.classList.remove('current', 'compared', 'swapped', 'sorted');
    });
}

function updateCurrentAlgorithmName(){
    let name = document.getElementById('algorithmName');
    name.innerHTML = `Current Algorithm: ${algoName} ${isAscending ? "(Ascending)" : "(Descending)"}`
}

function createBars(arr) {
  const container = document.getElementById('sorting-container');
  container.innerHTML = '';  
  console.log(Math.floor(400 / arr.length))
  arr.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = `${value}%`; 
    bar.style.width = `${Math.floor(800 / arr.length)}px`; 
    bar.setAttribute('data-index', index);
    bar.setAttribute('data-value', value);

    container.appendChild(bar);
  });
}

function updateBars(){
    const barCount = document.getElementById("numBars").value
    createBars(generateRandomArray(barCount))
}

function stop(){
    isAnimating = false;
    clearAllBarState()
    isAnimating = true;
}

function resetList(){
    isAnimating = false;
    updateBars();
    isAnimating = true;
}

function toggleDirection(){
    isAscending = !isAscending
    updateCurrentAlgorithmName()
}
document.addEventListener('DOMContentLoaded', function () {
    createBars(generateRandomArray(20));
});

// ----------------------------------------------- //

function bubbleSort() {
    algoName = "Bubble Sort"
    updateCurrentAlgorithmName()
    const bars = Array.from(document.querySelectorAll('.bar'));
    let i = 0;
    let j = 0;

    function animateBubbleSort() {
        if (!isAnimating) {
            return; 
        }
        const arr = bars.map(bar => parseInt(bar.getAttribute('data-value')));

        if (i < arr.length) { 
            if (j < arr.length - i - 1) {
                const currValue = arr[j];
                const nextValue = arr[j + 1];

                updateBarState(bars[j], 'current');

                if (isAscending ? currValue > nextValue : currValue < nextValue) {
                    
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                    
                    bars[j].style.height = `${arr[j]}%`;
                    bars[j + 1].style.height = `${arr[j + 1]}%`;

                    bars[j].setAttribute('data-value', arr[j]);
                    bars[j + 1].setAttribute('data-value', arr[j + 1]);
                } 

                j++;
                requestAnimationFrame(animateBubbleSort);  
            } else {
                document.querySelectorAll('.bar').forEach(bar => {
                    bar.classList.remove('current', 'compared', 'swapped');
                });

                bars[j].classList.add('sorted');
                
                j = 0;
                i++;
                requestAnimationFrame(animateBubbleSort);  
            }
        } 
    }
    animateBubbleSort();
}

function insertionSort() {
    algoName = "Insertion Sort"
    updateCurrentAlgorithmName()
    const bars = Array.from(document.querySelectorAll('.bar'));
    let i = 1; 
    
    function animateInsertionSort() {
        if (!isAnimating) {
            return; 
        }

        const arr = bars.map(bar => parseInt(bar.getAttribute('data-value')));

        if (i < arr.length) {
            let j = i - 1;
            const currentBar = bars[i]; 
            const currentValue = arr[i];

            updateBarState(currentBar, 'current'); 

            setTimeout(() => {
                shiftElements();
                currentBar.classList.remove('current');
            }, 200);  

            function shiftElements() {
                if (j >= 0 && (isAscending ? arr[j] > currentValue : arr[j] < currentValue)) {
                    [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];

                    bars[j + 1].style.height = `${arr[j + 1]}%`;
                    bars[j].style.height = `${arr[j]}%`;

                    bars[j + 1].setAttribute('data-value', arr[j + 1]);
                    bars[j].setAttribute('data-value', arr[j]);

                    j--; 
                    requestAnimationFrame(shiftElements);  
                } else {
                    bars[j + 1].style.height = `${currentValue}%`;
                    bars[j + 1].setAttribute('data-value', currentValue);
                    i++;  
                    requestAnimationFrame(animateInsertionSort);  
                }
            }
         } 
        else {
            document.querySelectorAll('.bar').forEach(bar => {
                bar.classList.add('sorted');
            });
        }
    }

    animateInsertionSort();
}

function selectionSort() {
    algoName = "Selection Sort";
    updateCurrentAlgorithmName();
    const bars = Array.from(document.querySelectorAll('.bar'));
    let i = 0;

    let lastTime = performance.now();

    function animateSelectionSort(timestamp) {
        if (!isAnimating) {
            return; 
        }

        const elapsed = timestamp - lastTime;
        if (elapsed < speed) {
            requestAnimationFrame(animateSelectionSort);
            return;
        }
        lastTime = timestamp;

        const arr = bars.map(bar => parseInt(bar.getAttribute('data-value')));

        if (i < arr.length - 1) {  
            let minIndex = i;
        
            for (let j = i + 1; j < arr.length; j++) {
                if (isAscending ? arr[j] < arr[minIndex] : arr[j] > arr[minIndex]) {
                    minIndex = j;
                }
            }

            if (minIndex !== i) {
                swapBars(i, minIndex, arr, bars);
            }

            bars[i].classList.add('sorted');
            i++;
            requestAnimationFrame(animateSelectionSort);
        } 
        else {
        
            document.querySelectorAll('.bar').forEach(bar => {
                bar.classList.add('sorted');
            });
        }
    }

    requestAnimationFrame(animateSelectionSort);
}

function swapBars(i, minIndex, arr, bars) {
    function swap() {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

        bars[i].style.height = `${arr[i]}%`
        bars[minIndex].style.height = `${arr[minIndex]}%`

        bars[i].setAttribute('data-value', arr[i]);
        bars[minIndex].setAttribute('data-value', arr[minIndex]);
    }
    requestAnimationFrame(swap);
}