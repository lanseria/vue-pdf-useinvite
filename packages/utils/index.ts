import { TypedArray } from "pdfjs-dist/types/display/api";

const getBufferArray = async (src: string) => {
  return (await fetch(src).then((res) => res.arrayBuffer())) as TypedArray;
};

export { getBufferArray };
