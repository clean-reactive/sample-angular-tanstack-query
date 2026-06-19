import { describe, it, expect } from 'vitest';
import {
  Injectable,
  InjectionToken,
  provideZonelessChangeDetection,
  signal,
  type Signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { createContext, injectContext, type Context } from './context';

@Injectable()
class Host {
  readonly orderId = signal('order-1');
  readonly itemId = signal('item-1');
}

const readContext = <T>(context: Context<T>): T =>
  TestBed.runInInjectionContext(() => injectContext(context));

describe(`${createContext.name}`, () => {
  it('uses the given name as the token description', () => {
    const context = createContext('OrderContext');

    expect(context.token).toBeInstanceOf(InjectionToken);
    expect(context.token.toString()).toContain('OrderContext');
  });

  it('falls back to a unique generated name when none is given', () => {
    const a = createContext();
    const b = createContext();

    expect(a.token.toString()).toMatch(/^InjectionToken Context#\d+$/);
    expect(b.token.toString()).toMatch(/^InjectionToken Context#\d+$/);
    expect(a.token.toString()).not.toBe(b.token.toString());
  });
});

describe(`${injectContext.name}`, () => {
  it('reads the value provided for the context token', () => {
    const context = createContext<{ id: string }>('IdContext');
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: context.token, useValue: { id: 'abc' } },
      ],
    });

    expect(readContext(context)).toEqual({ id: 'abc' });
  });

  it('throws a DI error naming the context when no provider is registered', () => {
    const context = createContext('MissingContext');
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });

    expect(() => readContext(context)).toThrow(/MissingContext/);
  });
});

describe(`${createContext.name}.provider (alias form)`, () => {
  it('shares the source instance under the context token', () => {
    const context = createContext<Host>('HostContext');
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), Host, context.provide(Host)],
    });

    const host = TestBed.inject(Host);

    expect(readContext(context)).toBe(host);
  });

  it('reflects later source signal updates', () => {
    const context = createContext<Host>('HostContext');
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), Host, context.provide(Host)],
    });

    const host = TestBed.inject(Host);
    const value = readContext(context);
    host.orderId.set('order-2');

    expect(value.orderId()).toBe('order-2');
  });
});

describe(`${createContext.name}.provider (factory form)`, () => {
  it('narrows a single dependency into a fresh object that keeps the picked signals', () => {
    const context = createContext<{ orderId: Signal<string> }>('OrderIdContext');
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        Host,
        context.provide([Host], (host) => ({ orderId: host.orderId })),
      ],
    });

    const host = TestBed.inject(Host);
    const value = readContext(context);

    expect(value).not.toBe(host);
    expect(Object.keys(value)).toEqual(['orderId']);
    expect(value.orderId).toBe(host.orderId);
  });

  it('reflects later source signal updates through the mapped signal', () => {
    const context = createContext<{ orderId: Signal<string> }>('OrderIdContext');
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        Host,
        context.provide([Host], (host) => ({ orderId: host.orderId })),
      ],
    });

    const host = TestBed.inject(Host);
    const value = readContext(context);
    host.orderId.set('order-3');

    expect(value.orderId()).toBe('order-3');
  });

  it('combines multiple dependencies into the context value', () => {
    @Injectable()
    class OrderHost {
      readonly orderId = signal('order-1');
    }
    @Injectable()
    class ItemHost {
      readonly itemId = signal('item-1');
    }
    const context = createContext<{ orderId: Signal<string>; itemId: Signal<string> }>('Combined');
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        OrderHost,
        ItemHost,
        context.provide([OrderHost, ItemHost], (order, item) => ({
          orderId: order.orderId,
          itemId: item.itemId,
        })),
      ],
    });

    const order = TestBed.inject(OrderHost);
    const item = TestBed.inject(ItemHost);
    const value = readContext(context);

    expect(value.orderId).toBe(order.orderId);
    expect(value.itemId).toBe(item.itemId);

    order.orderId.set('order-9');
    item.itemId.set('item-9');
    expect(value.orderId()).toBe('order-9');
    expect(value.itemId()).toBe('item-9');
  });
});
