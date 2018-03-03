(function (name, definition){
    if (typeof define === 'function'){ // AMD
      define(definition);
    } else if (typeof module !== 'undefined' && module.exports) { // Node.js
      module.exports = definition();
    } else { // Browser
      var theModule = definition(), global = this, old = global[name];
      theModule.noConflict = function () {
        global[name] = old;
        return theModule;
      };
      global[name] = theModule;
    }
  })('ShinyWebSocket', function () {
    function WebSocketRoute(p, w) {
        let self = this;
        let path = p;
        this.events = {
            onopen: [],
            onclose: [],
            onmessage: [],
            onerror: []
        }

        this.ws = w;
        let isOpened = false;
        let messageQueue = [];
        this.events.onopen.push(function() {
            isOpened = true;
            messageQueue.map(function(msg) {
                self.ws.send(msg);
            });
        });
        this.trySend = function(msg) {
            if(isOpened)
                return this.ws.send(msg);

            messageQueue.push(msg);
        }
    }
    
    function ShinyWebSocket(baseURL, evtEmitter) {
        let routes = {};
        this.baseURL = baseURL;


        this.CreateRoute = function (path) {
            let ws = new WebSocket(this.baseURL + path);
            let route = new WebSocketRoute(path, ws);

            ws.onopen = function() { 
                route.events.onopen.map(function(fn) {
                    fn.call(fn);
                })
            }

            ws.onclose = function() { 
                route.events.onclose.map(function(fn) {
                    fn.call(fn);
                })
            }

            ws.onmessage = function(args) {
                route.events.onmessage.map(function(fn) {
                    fn.call(fn, args);
                })
            }

            ws.onerror = function(args) {
                route.events.onerror.map(function(fn) {
                    fn.call(fn, args);
                })
            }

            routes[path] = route;
            return this;
        }

        this.OnOpen = function(path, fn) {
            let route = getRoute(path);
            route.events.onopen.push(fn);
            return this;
        }

        this.OnClose = function(path, fn) {
            let route = getRoute(path);
            route.events.onclose.push(fn);
            return this;
        }

        this.OnError = function(path, fn) {
            let route = getRoute(path);
            route.events.onerror.push(fn);
            return this;
        }

        this.OnMessage = function(path, fn) {
            let route = getRoute(path);
            route.events.onmessage.push(fn);
            return this;
        }

        this.Send = function(path, msg) {
            let route = getRoute(path);
            route.trySend(msg);
            return this;
        }

        function getRoute(path) {
            let route = routes[path];
            if(!route)
                throw new Error("Route does not exist");

            return route;
        }
    }

    return ShinyWebSocket;
  });