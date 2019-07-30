# async colorfield
Scripts:

- `npm lint` - prettier and eslint
- `npm start -- -p 3000` - Run custom port e.g. port 3000. Otherwise, defaults to port 1234

![Screenshot](/screenshot.png)

# How It Works:
- Once colors start, the loading message is visible.  Each bubble has a random timeout running behind it.  When the timeout completes the bubble will either finish loading (stroke around circle become gray) or it will reload again with a new fill color and timeout. 
- Loading cycles for each color change and timeout can be chained up to 5x, at which point a bubble is forced to complete.  
- When color loading completes for all bubbles, the completion message becomes visible. At this point bubbles can be hovered over to reveal a tooltip with statistics.  

# To Do:
- [ ] Explore how "restart colors" button could halt any remaining promise execution and then reset.

Helpful [D3 Tutorial](https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb)