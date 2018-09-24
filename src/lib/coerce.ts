import { from as fromDesc, to as toDesc } from '@ezy/object-description';
import { IncomingMessage, ServerResponse } from 'http';

/**
 * Generate a connect-style middleware that coerce values for a req property
 *
 * ### Example
 * ```js
 * import { coerce } from '@ezy/coerce-middleware'
 * import express from 'express'
 * const app = express()
 *
 * app.use(coerce('query'))
 *
 * app.get('/', (req, res) => {
 *   res.send(JSON.stringify(req.query))
 * })
 *
 * app.listen(3000)
 *
 * // GET /?id=30&is_admin=true&name=awesome%20title
 * // => {
 * //   name: 'awesome title',
 * //   id: 30,
 * //   is_admin: true
 * // }
 * ```
 *
 * @param property            req property to coerce (eg: 'query', 'params', etc...)
 * @param coercePrimitive     an alternative function to coerce stringified primitives
 * @returns                   a connect-style middleware
 */
export function coerce(
  property: string,
  coercePrimitive: (
    value: string
  ) => string | number | boolean | void = defaultCoercePrimitive
) {
  return (
    req: IncomingMessage,
    // @ts-ignore
    res: ServerResponse,
    next: (e?: Error) => void
  ) => {
    if (isPrimitive(req[property])) {
      return next();
    }

    try {
      req[property] = deepMap(req[property], value => {
        return typeof value === 'string' ? coercePrimitive(value) : value;
      });

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * check if a given value is a javascript primitive
 */
function isPrimitive(value) {
  return value !== Object(value);
}

/**
 * a map-like function for primitives in nested object or array
 *
 * @param object    any object/array.
 * @param mapFn     function to apply on primitive values.
 * @returns         the mapped object/array.
 */
function deepMap(object, mapFn: (value) => any): any {
  const desc = toDesc(object);

  const primitives = desc.primitives.map(primitive => {
    primitive.value = mapFn(primitive.value);
    return primitive;
  });

  return fromDesc({ is_array: desc.is_array, primitives });
}

/**
 * check if a given value is actually an integer
 */
const isInt = (value: string) => /^[0-9]+$/.test(value);

/**
 * check if a given value is actually a decimal number
 */
const isDecimal = (value: string) => /^([0-9]+)?\.[0-9]+$/.test(value);

/**
 * coerce a stringified primitive value
 *
 * @param value   any stringified primitive value.
 * @returns       the same value type converted.
 */
function defaultCoercePrimitive(value: string) {
  if (value === 'null') {
    return null;
  }
  if (value === 'true') {
    return true;
  }
  if (value === 'false') {
    return false;
  }
  if (isDecimal(value)) {
    return parseFloat(value);
  }
  if (isInt(value)) {
    return parseInt(value, 10);
  }
  return value;
}
