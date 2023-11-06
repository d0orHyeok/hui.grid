/**
 * @see https://github.com/FrontendMasters/observablish-values/tree/main
 */
export default function ov(...args) {
  // JS functions can't inherit custom prototypes, so we use prop() as a
  // proxy to the real ObservableValue instead.
  const observable = new ObservableValue();

  function prop(...args) {
    return observable.accessor.apply(prop, args);
  }

  for (const key in observable) {
    if (typeof observable[key] === 'function') {
      prop[key] = observable[key];
    } else {
      Object.defineProperty(prop, key, {
        get: () => observable[key],
        set: (value) => {
          observable[key] = value;
        },
      });
    }
  }

  prop(...args);
  return prop;
}

function ObservableValue() {
  this.previousValue = null;
  this.value = null;
  this.subscribers = [];
}

ObservableValue._computeActive = false;
ObservableValue._computeChildren = [];

ObservableValue.prototype.accessor = function accessor(newValue) {
  // If no arguments, return the value. If called inside a computed observable
  // value function, track child observables.
  if (!arguments.length) {
    if (ObservableValue._computeActive && ObservableValue._computeChildren.indexOf(this) === -1) {
      ObservableValue._computeChildren.push(this);
    }
    return this.value;
  }

  // If new value is same as previous, skip.
  else if (newValue !== this.value) {
    // If new value is not a function, save and publish.
    if (typeof newValue !== 'function') {
      this.previousValue = this.value;
      this.value = newValue;
      this.publish();
    }

    // If new value is a function, call the function and save its result.
    // Function can return a promise for async assignment. All additional
    // arguments are passed to the value function.
    else {
      const args = [];
      for (let i = 1; i < arguments.length; i++) {
        const arg = arguments[i];
        args.push(arg);
      }
      this.valueFunction = newValue;
      this.valueFunctionArgs = args;

      // Subscribe to child observables
      ObservableValue._computeActive = true;
      this.compute();
      ObservableValue._computeActive = false;
      ObservableValue._computeChildren.forEach((child) => {
        child.subscribe(() => this.compute());
      });
      ObservableValue._computeChildren.length = 0;
    }
  }
};

ObservableValue.prototype.publish = function publish() {
  this.subscribers.slice().forEach((handler) => {
    if (!handler) return;
    handler.call(this, this.value, this.previousValue);
  });
};

ObservableValue.prototype.subscribe = function subscribe(handler, immediate) {
  this.subscribers.push(handler);
  if (immediate) {
    handler.call(this, this.value, this.previousValue);
  }
  return () => ObservableValue.prototype.unsubscribe(handler);
};

ObservableValue.prototype.unsubscribe = function unsubscribe(handler) {
  const index = this.subscribers.indexOf(handler);
  this.subscribers.splice(index, 1);
};

// Note, currently there's no shortcut to cleanup a computed value.
ObservableValue.prototype.compute = function compute() {
  const result = this.valueFunction.apply(this, this.valueFunctionArgs);
  if (typeof result !== 'undefined') {
    if (typeof result.then === 'function') {
      result.then((asyncResult) => this(asyncResult));
    } else {
      this(result);
    }
  }
};
