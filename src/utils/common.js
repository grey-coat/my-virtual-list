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
export const BSStartIndex = (arr, num) => {
  let left = 0,
    right = arr.length - 1;

  while (left != right) {
    const mid = left + ((right - left) >> 1);
    if (arr[mid] > num) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return Math.max(0, left - 1);
}