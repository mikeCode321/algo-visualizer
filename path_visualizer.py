import pygame
from grid import Grid
import sys

def heuristic(goal, node):
    return abs(goal.x - node.x) + abs(goal.y - node.y)

def main():  
    pygame.init()
    pygame.display.set_caption('Path Visualizer')
    width = 500
    height = 500
    window = pygame.display.set_mode((500, 550))
    window.fill((0,0,0))
    fonts = pygame.font.SysFont("Helvetica", 20)
    text = fonts.render('Reset', True, (136, 255, 0))
    button = pygame.draw.rect(window, (50, 75,90), (205, 510, 75, 25), 3, 5)
    window.blit(text, (216, 513))
    grid = Grid(window, width, height, 25, 25)
    is_dijk_search_started = False
    is_a_star_search_started = False
    is_dfs_search_started = False
    searching = True
    start_box = None
    grid.create_grid()
    grid.add_neighbors()
    cost = dict()

    while True:
        for event in pygame.event.get():
            x,y = pygame.mouse.get_pos()
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

            if pygame.mouse.get_pressed()[0] and button.x <= x <= button.x + 75 and button.y <= y <= button.y+25:
                grid.reset()
                searching = True
                start_box = None
                is_dijk_search_started = False
                is_dfs_search_started = False

            elif event.type == pygame.MOUSEMOTION and y <= 500:
                if event.buttons[0]:
                    i = x // grid.column_width
                    j = y // grid.row_height 
                    grid.grid[j][i].wall = True

            if pygame.mouse.get_pressed()[0] is True and not grid.start_box_set and y <= 500:
                print("Left mouse clicked")
                i = x // grid.column_width
                j = y // grid.row_height
                start_box = grid.grid[j][i]
                start_box.starting_box = True
                grid.start_box_set = True
                grid.start_box = start_box
                grid.queue.append(start_box)
                grid.stack.append(start_box)
                grid.priorityq.insert((start_box, 0))
                cost[start_box] = 0
            if pygame.mouse.get_pressed()[2] is True and not grid.target_box_set and y <= 500:
                print("Right mouse button clicked")
                i = x // grid.column_width
                j = y // grid.row_height
                target_box = grid.grid[j][i]
                target_box.target_box = True
                grid.target_box_set = True 
                grid.target_box = target_box

            if event.type == pygame.KEYDOWN and grid.target_box_set:
                if event.key== pygame.K_w:
                    is_dijk_search_started = True
                if event.key == pygame.K_a:
                    is_dfs_search_started = True
                if event.key == pygame.K_s:
                    is_a_star_search_started = True
        
        if is_dijk_search_started:
            if len(grid.queue) > 0 and searching:
                current_box = grid.queue.pop(0)
                current_box.visited = True
                if current_box is grid.target_box:
                    searching = False
                    current_box = current_box.parent
                    while current_box is not grid.start_box:
                        grid.path.append(current_box)
                        current_box = current_box.parent
                    grid.start_box.visited = grid.target_box.visited = False
                    grid.start_box.queued = grid.target_box.queued = False
                else:
                    for next_box in current_box.neighbors:
                        if not next_box.queued and not next_box.visited and not next_box.wall:
                            next_box.queued = True
                            next_box.parent = current_box
                            grid.queue.append(next_box)

        if is_dfs_search_started:
            if len(grid.stack) > 0:
                current_node = grid.stack.pop()
                if not current_node.visited:
                    current_node.visited = True
                if current_node is grid.target_box:
                    current_node = current_node.parent
                    while current_node is not grid.start_box:
                        grid.path.append(current_node)
                        current_node = current_node.parent
                    is_dfs_search_started = False
                    grid.target_box.visited = False
                    grid.start_box.visited = False
                for neighbor in current_node.neighbors:
                    if not neighbor.visited and not neighbor.wall:
                        neighbor.parent = current_node
                        grid.stack.append(neighbor)
        
        if is_a_star_search_started:
            if len(grid.priorityq) > 0:
              current = grid.priorityq.get_priority()[0]
              current.visited = True

              if current is grid.target_box:
                  is_a_star_search_started = False  
                  current = current.parent
                  while current is not grid.start_box:
                    grid.path.append(current)
                    print(current.p)
                    current = current.parent
                  grid.target_box.visited = False
                  grid.target_box.queued = False
                  grid.start_box.visited = False

              for next in current.neighbors:
                  new_cost = cost[current] + 1
                  if (next not in cost or new_cost < cost[next]) and not next.wall:
                      cost[next] = new_cost
                      priority = new_cost + heuristic(grid.target_box, next)
                      next.p = priority
                      grid.priorityq.insert((next, priority))
                      next.parent = current
                      next.queued = True
             
        grid.update_grid()
        pygame.display.flip()



if __name__ == "__main__":
    main()