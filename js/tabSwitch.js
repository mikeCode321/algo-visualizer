// Get the tab buttons and section containers
const pathfindingTab = document.getElementById('pathfindingTab');
const sortingTab = document.getElementById('sortingTab');
const pathfindingSection = document.getElementById('pathfinding');
const sortingSection = document.getElementById('sorting');

// Function to switch tabs and toggle visibility of sections
function switchTab(event) {
  // Remove the 'active' class from both tabs and sections
  pathfindingTab.classList.remove('active');
  sortingTab.classList.remove('active');
  pathfindingSection.classList.remove('active');
  sortingSection.classList.remove('active');

  // Add the 'active' class to the clicked tab and corresponding section
  if (event.target === pathfindingTab) {
    pathfindingTab.classList.add('active');
    pathfindingSection.classList.add('active');
  } else if (event.target === sortingTab) {
    sortingTab.classList.add('active');
    sortingSection.classList.add('active');
  }
}

// Add event listeners for tab switching
pathfindingTab.addEventListener('click', switchTab);
sortingTab.addEventListener('click', switchTab);
