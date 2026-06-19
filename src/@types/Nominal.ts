declare const __nominal_type__: unique symbol;

export type Nominal<Type, Identifier> = Type & {
  readonly [__nominal_type__]: Identifier;
};
