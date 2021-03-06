// tslint:disable:no-expression-statement
import test from 'ava';
import { IncomingMessage, ServerResponse } from 'http';

import { coerce } from './coerce';

test('coerce stringified values', t => {
  const mw = coerce('query');

  const req: IncomingMessage & { query: any } = {
    query: {
      aborted: 'false',
      agree_terms: 'true',
      longDate: '2019-09-22T13:23:05.254Z',
      name: 'lorem ipsum',
      owner_id: '56',
      price: '24.99',
      shortDate: '2019-09-22'
    }
  } as any;

  const expected = {
    aborted: false,
    agree_terms: true,
    longDate: new Date('2019-09-22T13:23:05.254Z'),
    name: 'lorem ipsum',
    owner_id: 56,
    price: 24.99,
    shortDate: new Date('2019-09-22')
  };

  const res: ServerResponse = {} as any;
  const next = (e?: Error) => {
    t.deepEqual(e, undefined);
    t.deepEqual(req.query, expected);
  };

  mw(req, res, next);
});

test('coerce messy object', t => {
  const mw = coerce('body');

  const req: IncomingMessage & { body: any } = {
    body: {
      distance: '125.86',
      id: 12,
      name: 'lorem ipsum',
      someOtherField: 'null'
    }
  } as any;

  const expected = {
    distance: 125.86,
    id: 12,
    name: 'lorem ipsum',
    someOtherField: null
  };

  const res: ServerResponse = {} as any;
  const next = (e?: Error) => {
    t.deepEqual(e, undefined);
    t.deepEqual(req.body, expected);
  };

  mw(req, res, next);
});

test('use custom coercePrimitive function', t => {
  const coercePrimitive = () => {
    throw new Error('oops');
  };

  const mw = coerce('body', coercePrimitive);

  const body = {
    id: 10,
    name: 'name'
  };

  const req: IncomingMessage & { body: any } = {
    body
  } as any;

  const expected = new Error('oops');

  const res: ServerResponse = {} as any;
  const next = (e?: Error) => {
    t.deepEqual(e, expected);
    t.deepEqual(req.body, body);
  };

  mw(req, res, next);
});

test('dont change anything on primitive/undefined property', t => {
  const mw = coerce('method');

  const req: IncomingMessage = { method: 'GET' } as any;
  const res: ServerResponse = {} as any;

  const next = (e?: Error) => {
    t.deepEqual(e, undefined);
    t.deepEqual(req, { method: 'GET' } as any);
  };

  mw(req, res, next);

  const req2: IncomingMessage = {} as any;
  const res2: ServerResponse = {} as any;

  const next2 = (e?: Error) => {
    t.deepEqual(e, undefined);
    t.deepEqual(req2, {} as any);
  };

  mw(req2, res2, next2);
});
