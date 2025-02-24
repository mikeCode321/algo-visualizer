import math
import pygame
from box import Box 

class PriorityQ:

    def __init__(self) -> None:
        self.arr = []

    def __len__(self):
        return len(self.arr)

    def insert(self, box_and_pr):
        self.arr.append(box_and_pr)
        self.build_min_heap()

    def get_priority(self) -> Box:
        return self.arr.pop(0)

    def swap(self, i, j):
        temp = self.arr[i]
        self.arr[i] = self.arr[j]
        self.arr[j] = temp

    def min_heapify(self, index):
        left = self.get_left(index)
        right = self.get_right(index)

        if left < len(self.arr) and self.arr[left][1] < self.arr[index][1]:
            smallest = left
        else: 
            smallest = index

        if right < len(self.arr) and self.arr[right][1] < self.arr[smallest][1]:
            smallest = right

        if smallest is not index:
            self.swap(index, smallest)
            self.min_heapify(smallest)

    def build_min_heap(self):
        for i in range(math.floor(len(self.arr) / 2), -1 , -1):
            self.min_heapify(i)

    def get_left(self, index):
        return (2 * index) + 1

    def get_right(self,index):
        return (2 * index) + 2


class Grid():

    def __init__(self, window, width, height, num_col, num_rows) -> None:
        self.window = window
        self.columns = num_col
        self.rows = num_rows
        self.column_width = width // num_col
        self.row_height = height // num_rows
        self.target_box_set = False
        self.start_box_set = False
        self.start_box = None
        self.target_box = None
        self.target_box_found = False
        self.grid = []
        self.path = []
        self.queue = []
        self.stack = []
        self.priorityq = PriorityQ()

    def add_path(self, val):
        self.path.append(val)
    
    def add_queue(self, val):
        self.path.append(val)
    
    def create_grid(self):
        for row in range(self.rows):
            arr = []
            for col in range(self.columns):
                arr.append(Box(col, row))
            self.grid.append(arr)
    
    def add_neighbors(self):
        for row in range(self.rows):
            for col in range(self.columns):
                self._set_neighbors(self.grid[row][col])

    def _set_neighbors(self, box: Box):
        if box.x > 0:
            box.neighbors.append(self.grid[box.y][box.x - 1])
        if box.x < self.columns - 1:
            box.neighbors.append(self.grid[box.y][box.x + 1])
        if box.y > 0:
            box.neighbors.append(self.grid[box.y - 1][box.x])
        if box.y < self.rows - 1:
            box.neighbors.append(self.grid[box.y + 1][box.x])

    def draw(self, win, color, box):
        pygame.draw.rect(win, color, (box.x * self.column_width, box.y * self.row_height, self.column_width -  2, self.row_height - 2))

    def reset(self):
        for i in self.path:
            i.parent = None
        for row in range(self.rows):
            for col in range(self.columns):
                self.grid[row][col].reset()
        self.target_box_set = self.start_box_set = False
        self.start_box = self.target_box = None
        self.queue.clear()
        self.path.clear()
        
    def update_grid(self):
        window = self.window
        for row in range(self.rows):
            for col in range(self.columns):
                box = self.grid[row][col]
                self.draw(window, (50, 50, 50), box)

                if box.starting_box:
                    self.draw(window, (80, 114, 85), box)
                if box.wall:
                    self.draw(window, (141,145,139), box)
                if box.target_box:
                    self.draw(window, (26, 135, 199), box)
                if box.queued:
                    self.draw(window, (255, 102, 99), box)
                if box.visited:
                    self.draw(window, (13, 231, 97), box)
                if box in self.path:
                    self.draw(window, (0, 0, 200), box)
    

