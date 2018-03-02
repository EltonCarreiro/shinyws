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
    function TinyEventEmitter() {
        let events = {};

        this.on = function(evtName, fn) {
            let evt = events[evtName] || [];
            evt.push(fn);
        }

        this.emit = function(eventName, args) {
            let evt = events[evtName] || [];
            if(!evt)
                return;

            evt.map(function(fn) { fn.call(fn, args); });
        }

        this.remove = function(evtName, fn) {
            let evt = events[evtName] || [];
            if(!evt)
                return;

            let idx = evt.indexOf(fn);
            if(id > -1)
                evt.splice(idx, 1);
        }
    }

    function WebSocketRoute(p, w) {
        let path = p;
        let events = {
            onconnect: [],
            onclose: [],
            onmessage: [],
            onerror: []
        }

        let ws = w;
    }
    
    function ShinyWebSocket(baseURL, evtEmitter) {
        let routes = {};
        let eventEmitter = evtEmitter || new TinyEventEmitter();
        this.baseURL = baseURL;

        this.CreateRoute = function (path) {
            let ws = new WebSocket(this.baseURL + path);
            let route = new WebSocketRoute(path, ws);

            ws.onopen = function() { 
                eventEmitter.emit('open', { route: route });
            }

            ws.onclose = function() { 
                eventEmitter.emit('close', { route: route });
            }

            ws.onmessage = function(args) {
                eventEmitter.emit('message', { route: route, args: args });
            }

            ws.onerror = function(args) {
                eventEmitter.emit('error', { route: route, args: args });
            }

            routes[path] = route;
            return this;
        }

        this.OnOpen = function(path, fn) {
            let route = getRoute(path);
            route.onopen.push(fn);
            return this;
        }

        this.OnClose = function(path, fn) {
            let route = getRoute(path);
            route.onclose.push(fn);
            return this;
        }

        this.OnError = function(path, fn) {
            let route = getRoute(path);
            route.onerror.push(fn);
            return this;
        }

        this.OnMessage = function(path, fn) {
            let route = getRoute(path);
            route.onmessage.push(fn);
            return this;
        }

        function getRoute(path) {
            let route = routes[path];
            if(!route)
                throw new Error("Route does not exist");

            return route;
        }

        return ShinyWebSocket;
    }
  });