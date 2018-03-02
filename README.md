# ShinyWebSocket
Super lightweight and simple WebSocket client with routes support for browsers.

## Why routes

Since we don't have the concept of routing in the native websocket API, developers must define strategies to redirect the websocket messages in a way to classify them, wich can result in big and hard-to-read switch-cases.

So, routing is a way to easily organize your code and keep it as cleaner as possible.

## Example

Easily create your route and configure it:

```javascript
let ws = new ShinyWebSocket("ws://demos.kaazing.com/")
            .CreateRoute("/echo")
            .OnOpen("/echo", function() {
                document.body.innerHTML = "Connection Opened! - ";
            })
            .OnMessage("/echo", function(msg) { 
                document.body.innerHTML += msg.data
            });
```

Send messages to specific routes:

```javascript
 ws.Send("/echo", "Hello World!");
```

The object of the fluent syntax is to just help you to make one-time configuration, but you can attach event handlers or create routes anytime:

```javascript
  ws.OnMessage("/echo", function(msg) { 
    alert(msg.data);
  });
```
