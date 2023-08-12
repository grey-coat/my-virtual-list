export function throttle(func, time = 0, immediate = true) {
  let timer = null;
  return function () {
    if (immediate) {
      func.call(this, ...arguments);
      immediate = false;
    }
    if (timer == null) {
      timer = setTimeout(() => {
        func.call(this, ...arguments);
        timer = null;
      }, time)
    }
  }
}
export function RAFThrottle(func) {
  let flag = false;
  return function () {
    if (!flag) {
      window.requestAnimationFrame((timestamp) => {
        func.call(this, ...arguments);
        flag = false;
      })
      flag = true;
    }
  }
}