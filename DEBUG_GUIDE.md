# Debugging Guide for Garage Sale Finder

## Server Debugging

I've updated your VS Code launch configuration to better support debugging your Node.js server. Here's how to use it:

1. First, make sure no other Node.js server instances are running (stop any running servers)

2. In VS Code, set breakpoints in your server code by clicking in the gutter (the area to the left of the line numbers) in the file `server/index.js` or any other server files

3. Press F5 or go to the "Run and Debug" sidebar (the bug icon) and select "Debug Backend (Node.js)" from the dropdown menu, then click the green play button

4. The server will start in debug mode and your breakpoints will be hit when that code executes

## Full Stack Debugging

If you want to debug both the frontend and backend simultaneously:

1. Select "Debug Full Stack" from the dropdown in the Run and Debug sidebar
2. This will launch both the Node.js server in debug mode and Chrome with your React app

## Testing the API Endpoint

To test if your breakpoints are working:

1. Start the server in debug mode as described above
2. Open your browser and navigate to: http://localhost:3001/api/search?zipcode=33313&source=craigslist
3. Your breakpoints in the server code should be hit

## Common Issues

If breakpoints still aren't being hit:

1. Make sure you're using the VS Code debugger (F5) and not running the server with npm scripts
2. Check that the breakpoints are set in the correct files
3. Verify that the red dot appears in the gutter and doesn't have a hollow center (which indicates an unverified breakpoint)
4. Try adding the keyword `debugger;` directly in your code where you want to pause execution

Remember to restart the debugger after making changes to your launch configuration.
