//config
const link = "wss://ab.wim.agency/api",
  appName = "ab_game";

class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(name, fn) {
    const event = this.events.get(name);
    if (event) event.add(fn);
    else this.events.set(name, new Set([fn]));
  }

  emit(name, ...args) {
    const event = this.events.get(name);
    if (!event) return;
    for (const fn of event.values()) {
      fn(...args);
    }
  }

  remove(name, fn) {
    const event = this.events.get(name);
    if (!event) return;
    if (event.has(fn)) {
      event.delete(fn);
      return;
    }
  }

  clear(name) {
    if (name) this.events.delete(name);
    else this.events.clear();
  }
}

const CALL_TIMEOUT = 7 * 1000;
const PING_INTERVAL = 60 * 1000;
const RECONNECT_TIMEOUT = 2 * 1000;

const connections = new Set();

window.addEventListener("online", () => {
  for (const connection of connections) {
    if (!connection.connected) connection.open();
  }
});

class MetacomError extends Error {
  constructor({ message, code }) {
    super(message);
    this.code = code;
  }
}

class MetacomInterface {
  constructor() {
    this._events = new Map();
  }

  on(name, fn) {
    const event = this._events.get(name);
    if (event) event.add(fn);
    else this._events.set(name, new Set([fn]));
  }

  emit(name, ...args) {
    const event = this._events.get(name);
    if (!event) return;
    for (const fn of event.values()) fn(...args);
  }
}

class Metacom extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this.url = url;
    this.socket = null;
    this.api = {};
    this.callId = 0;
    this.calls = new Map();
    this.streams = new Map();
    this.active = false;
    this.connected = false;
    this.lastActivity = new Date().getTime();
    this.callTimeout = options.callTimeout || CALL_TIMEOUT;
    this.pingInterval = options.pingInterval || PING_INTERVAL;
    this.reconnectTimeout = options.reconnectTimeout || RECONNECT_TIMEOUT;
    this.open();
  }

  static create(url, options) {
    const { transport } = Metacom;
    const Transport = url.startsWith("ws") ? transport.ws : transport.http;
    return new Transport(url, options);
  }

  message(data) {
    if (data === "{}") return;
    this.lastActivity = new Date().getTime();
    let packet;
    try {
      packet = JSON.parse(data);
    } catch {
      return;
    }
    const [callType, target] = Object.keys(packet);
    const callId = packet[callType];
    const args = packet[target];
    if (callId && args) {
      if (callType === "callback") {
        const promised = this.calls.get(callId);
        if (!promised) return;
        const [resolve, reject] = promised;
        this.calls.delete(callId);
        if (packet.error) {
          reject(new MetacomError(packet.error));
          return;
        }
        resolve(args);
        return;
      }
      if (callType === "event") {
        const [interfaceName, eventName] = target.split("/");
        const metacomInterface = this.api[interfaceName];
        metacomInterface.emit(eventName, args);
      }
      if (callType === "stream") {
        const { name, size, status } = packet;
        if (name) {
          const stream = { name, size, chunks: [], received: 0 };
          this.streams.set(callId, stream);
          return;
        }
        const stream = this.streams.get(callId);
        if (status) {
          this.streams.delete(callId);
          const blob = new Blob(stream.chunks);
          blob.text().then((text) => {});
          return;
        }
      }
    }
  }

  async load(...interfaces) {
    const introspect = this.scaffold("system")("introspect");
    const introspection = await introspect(interfaces);
    const available = Object.keys(introspection);
    for (const interfaceName of interfaces) {
      if (!available.includes(interfaceName)) continue;
      const methods = new MetacomInterface();
      const iface = introspection[interfaceName];
      const request = this.scaffold(interfaceName);
      const methodNames = Object.keys(iface);
      for (const methodName of methodNames) {
        methods[methodName] = request(methodName);
      }
      this.api[interfaceName] = methods;
    }
  }

  scaffold(iname, ver) {
    return (methodName) =>
      async (args = {}) => {
        const callId = ++this.callId;
        const interfaceName = ver ? `${iname}.${ver}` : iname;
        const target = interfaceName + "/" + methodName;
        if (!this.connected) await this.open();
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            if (this.calls.has(callId)) {
              this.calls.delete(callId);
              reject(new Error("Request timeout"));
            }
          }, this.callTimeout);
          this.calls.set(callId, [resolve, reject]);
          const packet = { call: callId, [target]: args };
          this.send(JSON.stringify(packet));
        });
      };
  }
}

class WebsocketTransport extends Metacom {
  async open() {
    if (this.connected) return;
    const socket = new WebSocket(this.url);
    this.active = true;
    this.socket = socket;
    connections.add(this);

    socket.addEventListener("message", ({ data }) => {
      if (typeof data === "string") {
        this.message(data);
        return;
      }
    });

    socket.addEventListener("close", () => {
      this.connected = false;
      setTimeout(() => {
        if (this.active) this.open();
      }, this.reconnectTimeout);
    });

    socket.addEventListener("error", (err) => {
      this.emit("error", err);
      socket.close();
    });

    setInterval(() => {
      if (this.active) {
        const interval = new Date().getTime() - this.lastActivity;
        if (interval > this.pingInterval) this.send("{}");
      }
    }, this.pingInterval);

    return new Promise((resolve) => {
      socket.addEventListener("open", async () => {
        this.connected = true;
        if (!metacom.api["auth"]) await metacom.load("auth");
        const token = localStorage.getItem(appName);
        if (!token) {
          metacom.isLogin = false;
          const reg = await metacom.api["auth"]["register"]();
          if (reg.status === "success") {
            metacom.isLogin = true;
            localStorage.setItem(appName, reg.token);
            this.login = true;
          }
        } else {
          const res = await metacom.api["auth"]["restoreSession"](token);
          if (res.status === "success") {
            metacom.isLogin = true;
            localStorage.setItem(appName, res.token);
          }
        }
        let event = new Event("metaconnect", { bubbles: true });
        document.dispatchEvent(event);
        resolve();
      });
    });
  }

  close() {
    this.active = false;
    connections.delete(this);
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
  }

  send(data) {
    if (!this.connected) return;
    this.lastActivity = new Date().getTime();
    this.socket.send(data);
  }
}

class HttpTransport extends Metacom {
  async open() {
    this.active = true;
    this.connected = true;
  }

  close() {
    this.active = false;
    this.connected = false;
  }

  send(data) {
    this.lastActivity = new Date().getTime();
    fetch(this.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    }).then((res) => {
      const { status } = res;
      if (status === 200) {
        return res.text().then((packet) => {
          if (packet.error) throw new MetacomError(packet.error);
          this.message(packet);
        });
      }
      throw new Error(`Status Code: ${status}`);
    });
  }
}

Metacom.transport = {
  ws: WebsocketTransport,
  http: HttpTransport,
};
const metacom = Metacom.create(link);
window.metacom = metacom;

class App {
  constructor() {
    this.waiting = [];
    metacom.emit();
  }

  acquire() {
    return new Promise((resolve, err) => {
      this.waiting.push({ resolve: resolve, err: err });
    });
  }

  take() {
    if (this.waiting.length > 0) {
      let promise = this.waiting.shift();
      promise.resolve();
    }
  }

  async push(path, method, body = {}) {
    if (!metacom.connected) await this.acquire();
    this.take();
    try {
      if (!path && !method) return false;
      if (!metacom.api[path]) await metacom.load(path);
      const request = await metacom.api[path][method](body);
      return request;
    } catch (error) {
      return error;
    }
  }
}

// const app = new App()

export default App;