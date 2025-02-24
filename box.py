
class Box():

    def __init__(self, i, j) -> None:
        self.x = i
        self.y = j
        self.starting_box = False
        self.target_box = False
        self.wall = False
        self.queued = False
        self.visited = False
        self.parent = None
        self.dirn = 0
        self.p = 0
        self.neighbors = []
    
    def reset(self):
        self.wall = self.queued = self.visited = self.starting_box = self.target_box = False

   

   

    
    
