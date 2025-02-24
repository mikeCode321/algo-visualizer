from flask import Flask, jsonify, render_template, request
import heapq
import time

app = Flask(__name__)

# Create a 25x25 grid
GRID_SIZE = 25

# Direction vectors for 4-way movement (Up, Right, Down, Left)
DIRECTIONS = [(-1, 0), (1, 0), (0, -1), (0, 1)]

def dfs(grid, start, target):
    # Depth-First Search algorithm (returns steps to animate)
    stack = [start]
    visited = set()
    steps = []

    while stack:
        current = stack.pop()
        steps.append(current)  # Log this step for animation
        if current == target:
            break
        visited.add(current)
        
        # Explore neighbors
        for dx, dy in DIRECTIONS:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < GRID_SIZE and 0 <= ny < GRID_SIZE and (nx, ny) not in visited and grid[nx][ny] != 1:
                stack.append((nx, ny))
    
    return steps

def bfs(grid, start, target):
    # Breadth-First Search algorithm (returns steps to animate)
    queue = [start]
    visited = set()
    parent_map = {}
    steps = []

    while queue:
        current = queue.pop(0)
        steps.append(current)  # Log this step for animation
        if current == target:
            path = []
            while current in parent_map:
                path.append(current)
                current = parent_map[current]
            path.append(start)
            return steps  # Return steps for animation
        
        visited.add(current)
        
        # Explore neighbors
        for dx, dy in DIRECTIONS:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < GRID_SIZE and 0 <= ny < GRID_SIZE and (nx, ny) not in visited and grid[nx][ny] != 1:
                parent_map[(nx, ny)] = current
                queue.append((nx, ny))
    
    return steps

def a_star(grid, start, target):
    # A* algorithm (returns steps to animate)
    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    open_list = []
    heapq.heappush(open_list, (0, start))
    g_costs = {start: 0}
    f_costs = {start: heuristic(start, target)}
    parent_map = {}
    steps = []

    while open_list:
        _, current = heapq.heappop(open_list)
        steps.append(current)  # Log this step for animation
        
        if current == target:
            path = []
            while current in parent_map:
                path.append(current)
                current = parent_map[current]
            path.append(start)
            return steps  # Return steps for animation
        
        # Explore neighbors
        for dx, dy in DIRECTIONS:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < GRID_SIZE and 0 <= ny < GRID_SIZE and grid[nx][ny] != 1:
                g_new = g_costs[current] + 1
                f_new = g_new + heuristic((nx, ny), target)
                if (nx, ny) not in g_costs or g_new < g_costs[(nx, ny)]:
                    g_costs[(nx, ny)] = g_new
                    f_costs[(nx, ny)] = f_new
                    heapq.heappush(open_list, (f_new, (nx, ny)))
                    parent_map[(nx, ny)] = current
    
    return steps

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/algorithm', methods=['POST'])
def run_algorithm():
    data = request.json
    grid = data['grid']
    start = tuple(data['start'])
    target = tuple(data['target'])
    algorithm = data['algorithm']
    
    if algorithm == "dfs":
        steps = dfs(grid, start, target)
    elif algorithm == "bfs":
        steps = bfs(grid, start, target)
    elif algorithm == "a_star":
        steps = a_star(grid, start, target)
    
    return jsonify(steps)

if __name__ == '__main__':
    app.run(debug=True)
