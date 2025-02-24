import pygame
import random

pygame.init()

class DrawingInfo:
    BLACK = 0, 0, 0 
    WHITE = 255, 255, 255
    GREEN = 0, 255, 0
    RED = 255, 0, 0 
    GRADIENTS = [(128, 128, 128), (160, 160, 160), (192, 192, 192)]
    BACKGROUND_COLOR = WHITE
    FONT = pygame.font.SysFont('comicsans' , 20)
    LARGE_FONT = pygame.font.SysFont('comicsans' , 30)

    SIDE_PAD = 100 #50 pixel padding on left and 50 on right 
    TOP_PAD = 150

    def __init__(self, width, height, lst) -> None:
        self.width = width 
        self.height = height

        self.window = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Sorting Algorithm Visualizer")
        self.set_list(lst)

    def set_list(self, lst):
        self.lst = lst
        self.min_val = min(lst)
        self.max_val = max(lst)

        self.block_width = (self.width - self.SIDE_PAD) // len(lst)
        self.block_height = (self.height - self.TOP_PAD) // (self.max_val - self.min_val)
        self.start_x = self.SIDE_PAD // 2

def generate_starting_list(n, min_val, max_val):
    lst = []

    for _ in range(n):
        val = random.randint(min_val, max_val)
        lst.append(val)

    return lst

def draw(draw_info: DrawingInfo, algo_name, asc):
    draw_info.window.fill(draw_info.BACKGROUND_COLOR)
    
    title = draw_info.LARGE_FONT.render(f"{algo_name} - {'Ascending' if asc else 'Descending'}", 1, draw_info.GREEN)
    draw_info.window.blit(title, (draw_info.width/2 - title.get_width()/2, 5))
    
    controls = draw_info.FONT.render("R - Reset | SPACE - Start Sorting | A - Ascending | D - Desending", 1, draw_info.BLACK)
    draw_info.window.blit(controls, (draw_info.width/2 - controls.get_width()/2, 45))
    
    sorting = draw_info.FONT.render("I - Insertion Sort | B - Bubble Sort | Q - Quick Sort | M - Merge Sort", 1, draw_info.BLACK)
    draw_info.window.blit(sorting, (draw_info.width/2 - sorting.get_width()/2, 70))
    
    draw_list(draw_info)
    pygame.display.update()

def draw_list(draw_info: DrawingInfo, color_pos={}, clear_bg=False):
    lst = draw_info.lst

    if clear_bg:
        clear_rect = (draw_info.SIDE_PAD//2, draw_info.TOP_PAD, draw_info.width - draw_info.SIDE_PAD,
                       draw_info.height - draw_info.TOP_PAD)
        pygame.draw.rect(draw_info.window, draw_info.BACKGROUND_COLOR, clear_rect)

    for i, val in enumerate(lst):
        x = draw_info.start_x + (i * draw_info.block_width)
        y = draw_info.height - (val - draw_info.min_val) * draw_info.block_height

        color = draw_info.GRADIENTS[i % 3]
        if i in color_pos:
            color = color_pos[i]

        pygame.draw.rect(draw_info.window, color, (x,y,draw_info.block_width, draw_info.height - y)) # change tp draw_info.height only if posing problem
    
    if clear_bg:
        pygame.display.update()

def insertion_sort(draw_info: DrawingInfo, ascending=True):
    lst = draw_info.lst

    if ascending:
        for i in range(1, len(lst)):
            key = lst[i]
            j = i - 1
            while j >= 0 and lst[j] > key:
                lst[j + 1] = lst[j]
                j -=1
            lst[j + 1] = key
            draw_list(draw_info, {j+1: draw_info.GREEN, i: draw_info.RED}, True)
            yield True
    else:
        for i in range(1, len(lst)):
            key = lst[i]
            j = i - 1
            while j >= 0 and lst[j] < key:
                lst[j + 1] = lst[j]
                j -=1
            lst[j + 1] = key
            draw_list(draw_info, {j+1: draw_info.GREEN, i: draw_info.RED}, True)
            yield True
    # return lst

def bubble_sort(draw_info: DrawingInfo, ascending=True):
    lst = draw_info.lst
    for i in range(len(lst)):
        swapped = False
        for j in range(len(lst) - i - 1):
            if (lst[j] > lst[j + 1]) and ascending:
                lst[j + 1], lst[j] = lst[j], lst[j + 1]
                swapped = True
                draw_list(draw_info, {j: draw_info.GREEN, j+1: draw_info.RED}, True)
                yield True
            
            if (lst[j] < lst[j + 1]) and not ascending:
                lst[j + 1], lst[j] = lst[j], lst[j + 1]
                swapped = True
                draw_list(draw_info, {j: draw_info.GREEN, j+1: draw_info.RED}, True)
                yield True

        if not swapped:
            break

def asc_partition(draw_info: DrawingInfo, low, high, asc):
    lst = draw_info.lst
    pivot = lst[high]
    i = low - 1
    for j in range(low, high):
        if (lst[j] < pivot and asc) or (lst[j] > pivot and not asc):
            i += 1
            lst[i], lst[j] = lst[j], lst[i]
            draw_list(draw_info, {i : draw_info.GREEN, j: draw_info.RED, high: draw_info.BLACK}, True)
            yield True
    lst[i + 1], lst[high] = lst[high], lst[i + 1]
    return i + 1

def quick_sort(draw_info: DrawingInfo, low, high, asc=True):
    stack = []
    stack.append(low)
    stack.append(high)

    while len(stack) > 0:
        high = stack.pop()
        low = stack.pop()

        p = yield from asc_partition(draw_info, low, high, asc)

        if p-1 > low:
            stack.append(low)
            stack.append(p - 1)

        if p + 1 < high:
            stack.append(p + 1)
            stack.append(high)
        yield True

def merge(draw_info:DrawingInfo, arr, low, mid, high):
        
        left = arr[low:mid + 1]
        right = arr[mid + 1:high + 1]

        left.append(99999)
        right.append(99999)
        
        i = j = 0
       
        for k in range(low, high + 1):
            if left[i] <= right[j]:
                arr[k] = left[i]
                i += 1
            else:
                arr[k] = right[j]
                j += 1
            draw_list(draw_info, {low + i : draw_info.GREEN, mid + 1 + j: draw_info.RED }, True)
            yield 


def merge_sort(draw_info: DrawingInfo, low, high, asc=True):
    lst = draw_info.lst
    if low < high:
                mid = (low + high)//2

                yield from merge_sort(draw_info, low, mid)
                yield from merge_sort(draw_info, mid + 1, high)
                yield from merge(draw_info, lst, low, mid, high)
                
   
def main():
    run = True
    clock = pygame.time.Clock()
    n = 100
    min_val = 0
    max_val = 100

    lst = generate_starting_list(n, min_val, max_val)
    draw_info = DrawingInfo(700, 500, lst)
    sorting = False
    asc = True

    sorting_algo = bubble_sort
    sorting_algo_name = "Bubble Sort"
    sorting_algo_generator = None

    while run:
        clock.tick(60) #frames per second this loop runs
        if sorting:
            try:
                next(sorting_algo_generator)
            except StopIteration:
                sorting = False
        else:
            draw(draw_info, sorting_algo_name, asc)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                run = False

            if event.type != pygame.KEYDOWN:
                continue

            if event.key == pygame.K_r:
                lst = generate_starting_list(n, min_val, max_val)
                draw_info.set_list(lst)
                sorting = False
                asc = True
            elif event.key == pygame.K_SPACE and not sorting:    
                if sorting_algo_name == "Merge Sort":
                    sorting = True
                    sorting_algo_generator = sorting_algo(draw_info, 0, len(draw_info.lst) - 1, asc)
                elif sorting_algo_name == "Quick Sort":
                    sorting = True
                    sorting_algo_generator = sorting_algo(draw_info, 0, len(draw_info.lst) - 1, asc)
                else: 
                    sorting = True
                    sorting_algo_generator = sorting_algo(draw_info, asc)
            elif event.key == pygame.K_a and not sorting:
                asc = True
            elif event.key == pygame.K_d and not sorting:
                asc = False
            elif event.key == pygame.K_i and not sorting:
                sorting_algo = insertion_sort
                sorting_algo_name = "Insertion Sort"
            elif event.key == pygame.K_b and not sorting:
                sorting_algo = bubble_sort
                sorting_algo_name = "Bubble Sort"
            elif event.key == pygame.K_q and not sorting:
                sorting_algo = quick_sort
                sorting_algo_name = "Quick Sort"
            elif event.key == pygame.K_m and not sorting:
                sorting_algo = merge_sort
                sorting_algo_name = "Merge Sort"
                
    pygame.quit()

if __name__ == "__main__":
    main()


        