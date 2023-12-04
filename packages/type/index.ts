module wUnion {
  // 兩個 union type 取交集
  export type Intersection<T, U> = T extends U ? T : never

  // ToTuple START
  type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

  type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

  type Push<T extends any[], V> = [...T, V];

  export type ToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
    true extends N ? [] : Push<ToTuple<Exclude<T, L>>, L>
  // ToTuple END
}

module wObject {
  export type RecursiveKeyOf<Obj extends object, Sep extends string = '.'> = {
    [K in keyof Obj & (string | number)]:
    Obj[K] extends object
      ? `${K}` | `${K}${Sep}${RecursiveKeyOf<Obj[K]>}`
      : `${K}`;
  }[keyof Obj & (string | number)]
}

module wString {
  export type FirstUppercase<Str extends string> = Str extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : never
}

export type {
  wUnion,
  wObject,
  wString,
}