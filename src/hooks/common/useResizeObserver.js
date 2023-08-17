import { provide } from "vue";

export const useResizeObserver = (cb) => {
  const resizeOb = new ResizeObserver(cb);
  provide("resizeOb", resizeOb);
}