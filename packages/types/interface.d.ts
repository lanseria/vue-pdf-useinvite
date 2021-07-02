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

interface CommonOption {
  icon: string;
  name: string;
  func: Fn;
  type?: "primary" | "default";
  hidden?: boolean;
}

interface ColumnsMapOption {
  width?: number;
  label: string;
  prop: string;
  type?: "dict" | "dataDict" | "date" | "slot";
  dictName?: string;
  format?: string;
  hidden?: boolean;
  /**
   * default: undefined === false
   */
  complete?: boolean;
}

interface IdName extends IObj {
  id: number | null;
  name: string;
}
interface LabelValue {
  value: string | number | null;
  label: string;
}
interface Attachment extends IObj {
  name: string;
  url: string;
}
interface CommonTree extends IObj {
  children: CommonTree[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EmitType = (event: string, ...args: any[]) => void;

interface DateCell {
  type: string;
  date: Date;
  day: string;
  isSelected: boolean;
}
