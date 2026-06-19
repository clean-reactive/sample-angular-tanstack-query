import { inject, InjectionToken, type Provider, type ProviderToken } from '@angular/core';

/** Resolved instance types for a tuple of provider tokens. */
type ProviderInstances<D extends readonly ProviderToken<unknown>[]> = {
  -readonly [K in keyof D]: D[K] extends ProviderToken<infer U> ? U : never;
};

export interface Context<T> {
  readonly token: InjectionToken<T>;
  /** Alias an existing source that already satisfies the context shape. */
  provide<S extends T>(source: ProviderToken<S>): Provider;
  /** Build the context value from one or more injected dependencies. */
  provide<const D extends readonly ProviderToken<unknown>[]>(
    deps: D,
    factory: (...deps: ProviderInstances<D>) => T,
  ): Provider;
}

let uid = 0;

export function createContext<T>(name = `Context#${++uid}`): Context<T> {
  const token = new InjectionToken<T>(name);

  function provide<S extends T>(source: ProviderToken<S>): Provider;
  function provide<const D extends readonly ProviderToken<unknown>[]>(
    deps: D,
    factory: (...deps: ProviderInstances<D>) => T,
  ): Provider;
  function provide(
    sourceOrDeps: ProviderToken<unknown> | readonly ProviderToken<unknown>[],
    factory?: (...deps: never[]) => T,
  ): Provider {
    return factory
      ? { provide: token, useFactory: factory, deps: [...(sourceOrDeps as readonly unknown[])] }
      : { provide: token, useExisting: sourceOrDeps as ProviderToken<unknown> };
  }

  return { token, provide };
}

export function injectContext<T>(context: Context<T>): T {
  return inject(context.token);
}

export type ContextValue<C> = C extends Context<infer T> ? T : never;
