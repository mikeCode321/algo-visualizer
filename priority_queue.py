import math

class PriorityQueue:

    def __init__(self, length=10) -> None:
        self.arr = [] #[(dist, Vertex), ...]
        self.length = length
        
    def insert(self, val):
        if len(self.arr) == self.length:
            return
        self.arr.append(val)
        self.build_min_heap()

    def delete(self, index):
        if len(self.arr) == 0:
            return
        self.swap(index, len(self.arr) - 1)
        temp = self.arr.pop(len(self.arr) - 1)
        self.build_min_heap()
        return temp[1]

    def get_left(self, index):
        return 2 * index

    def get_right(self, index):
        return (2 * index) + 1

    def get_parent(self, index):
        return math.floor(index / 2)

    def swap(self, index1, index2):
        temp = self.arr[index1]
        self.arr[index1] = self.arr[index2]
        self.arr[index2] = temp

    def min_heapify(self, index):
        left = self.get_left(index)
        right = self.get_right(index)

        if left < len(self.arr) and self.arr[left][0] < self.arr[index][0]:
            smallest = left
        else:
            smallest = index
        if right < len(self.arr) and self.arr[right][0] < self.arr[smallest][0]:
            smallest = right
        if smallest != index:
            self.swap(index, smallest)
            self.min_heapify(smallest)

    def build_min_heap(self):
        for index in range(math.floor(len(self.arr) - 1/ 2), -1, -1):
            self.min_heapify(index)

    def __str__(self) -> str:
        return "{}".format([ (x, y) for x, y in self.arr])
    
    def __len__(self):
        return len(self.arr)

