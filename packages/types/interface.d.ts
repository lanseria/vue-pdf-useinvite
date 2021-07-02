/* eslint-disable @typescript-eslint/no-explicit-any */
interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

interface IObj<T = any> {
  [key: string]: T;
  [key: number]: T;
}
