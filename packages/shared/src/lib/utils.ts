type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Merge<T1, T2> = Prettify<Omit<T1, keyof T2> & T2>;
