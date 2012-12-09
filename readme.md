#Task List Demo
This is a simple demo meant to demonstrate many HTML5, JavaScript, and CSS3 techniques together.

##Demo Concept
The Task List demo app primarily features the ability for users to enter a task as text that is then saved to a local list of tasks. Users can also assign tasks to sample team members (via drag-n-drop), drag-in new tasks from the desktop, and delete existing tasks.

###Browser Requirements
Since this is a HTML5 demo app, the primary goal is to show-off features available in HTML5. While some features have been polyfilled to work in new and old browsers alike, the demo is optimized for newer browsers.

For the best experience, use an up-to-date [Chrome browser](https://www.google.com/chrome).

###Internet Explorer
The complete demo will only work in IE10+ due to the use of HTML5 features such as IndexedDB and Web Sockets (which are not available in <= IE9). With the use of more complex polyfills, the demo could be made to work in IE9, but that is out of scope for this demo today.

##HTML5 Features
The demo showcases many HTML5 technologies, some broadly usable today, some less likely to work in all browsers. Today, the demo includes the following:

- Semantic tags (page markup)
- Data-* attributes (task list item ID)
- Video (universal video)
- HTML5 Forms (input validation)
- Geolocation (map with user location)
- Local Storage (save typing progress)
- Drag-n-Drop (drag task to assign)
- WebSQL/IndexedDB (task persistence)
- Web Sockets (task broadcasting)
- File API (reading text file)

##CSS3 Features
In addition to HTML5, the demo also features many modern CSS3 techniques, including:

- CSS3 Selectors (alternating row colors)
- Custom Fonts
- Borders & Backgrounds (rounded corners, multiple bgs)
- Drop Shadow
- Text Shadow
- Flexible Box Model
- CSS Gradients
- CSS Transitions
- CSS Animations
- Media Queries

##Running the Demo
If you want to try the complete demo on your machine, follow these steps:

1. Clone this repository to your computer (or download the complete repo ZIP archive)
2. Configure your local development web server to treat the repo folder as a web root
3. Load the "index.html" file from your localhost

If you are using a supported browser, the demo should load directly.

###Why use a web server?
Certain browsers, such as Chrome, impose additional restrictions on HTML pages loaded from the file:// protocol. To avoid unexpected errors, it is best to load the HTML pages from a local web server.

###External dependencies
To support the web sockets feature this demo has one external dependency. A simple NodeJS web sockets server is referenced within the project. This server uses SocketIO to facilitate basic web sockets communication between Task List Demo clients. If this server is unavailable, the web sockets features in this demo may not work.

The NodeJS SocketIO server is [available in this GitHub repo](https://github.com/toddanglin/NodeSocketDemo).

## Background
This demo was created by [Todd Anglin](http://twitter.com/toddanglin) for use in a full-day HTML5 workshop. It is intentionally simple in places to facilitate teaching. Special techniques, including polyfills, are only used when needed to make the demo function consistently in modern browsers (such as Chrome and Firefox).

