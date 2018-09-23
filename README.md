<h1 align="center">
  <img src="https://fakeimg.pl/900x300/ffffff/333333/?text=coerce+middleware&font=museo" alt="coerce middleware" width="900px" />
</h1>

<p align="center">coerce req.query or req.params or any other property in req object.</p>

<p align="center">
<a href="https://opensource.org/licenses">
  <img src="https://img.shields.io/github/license/ezylean/coerce-middleware.svg" alt="License" />
</a>
<a href="https://circleci.com/gh/ezylean/coerce-middleware/tree/master">
  <img src="https://circleci.com/gh/ezylean/coerce-middleware/tree/master.svg?style=shield" alt="CircleCI" />
</a>
<a href="https://codecov.io/gh/ezylean/coerce-middleware">
  <img src="https://codecov.io/gh/ezylean/coerce-middleware/branch/master/graph/badge.svg" alt="codecov" />
</a>
<a href="https://ezylean.github.io/coerce-middleware">
  <img src="https://img.shields.io/badge/docs-typedoc-%239B55FC.svg" alt="Docs: typedoc" />
</a>
<a href="https://github.com/ezylean/coerce-middleware/issues">
  <img src="https://img.shields.io/github/issues-raw/ezylean/coerce-middleware.svg" alt="GitHub issues" />
</a>
<a href="https://codeclimate.com/github/ezylean/coerce-middleware/maintainability" >
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/ezylean/coerce-middleware.svg" alt="Maintainability" />
</a>
<a href="https://david-dm.org/ezylean/coerce-middleware">
  <img src="https://david-dm.org/ezylean/coerce-middleware.svg" alt="Dependencies status" />
</a>
<a href="https://david-dm.org/ezylean/coerce-middleware?type=dev">
  <img src="https://david-dm.org/ezylean/coerce-middleware/dev-status.svg" alt="Dev Dependencies status" />
</a>
<a href="https://github.com/Microsoft/TypeScript">
  <img src="https://img.shields.io/badge/made%20with-typescript-%234B9DD5.svg" alt="Made with: typescript" />
</a>
<a href="https://github.com/prettier/prettier">
  <img src="https://img.shields.io/badge/code%20style-prettier-ff69b4.svg" alt="Code style: prettier" />
</a>
<a href="https://npm.runkit.com/@ezy/coerce-middleware">
  <img src="https://img.shields.io/badge/runkit-try%20now-%236967CA.svg" alt="Runkit: try now" />
</a>
<img src="https://img.shields.io/bundlephobia/min/@ezy/coerce-middleware.svg" alt="minified size" />
<img src="https://img.shields.io/bundlephobia/minzip/@ezy/coerce-middleware.svg" alt="minzipped size" />
</p>

## Why

Validation logic become simpler when it's possible to expect "typed" datas, but datas parsed from url like req.query or req.params are strings.

## Install

```shell
npm i @ezy/coerce-middleware
```

## Usage

### Common

```js
import { coerce } from '@ezy/coerce-middleware';
import express from 'express';
const app = express();

app.use(coerce('query'));

app.get('/', (req, res) => {
  res.send(JSON.stringify(req.query));
});

app.listen(3000);

// GET /?id=30&is_admin=true&name=awesome%20title
// => {
//   name: 'awesome title',
//   id: 30,
//   is_admin: true
// }
```

### use a custom coercePrimitive function

```js
import { coerce } from '@ezy/coerce-middleware';
import express from 'express';
const app = express();

app.use(coerce('query', value => '(^^)'));

app.get('/', (req, res) => {
  res.send(JSON.stringify(req.query));
});

app.listen(3000);

// GET /?id=30&is_admin=true&nested[name]=awesome%20title
// => {
//   nested: {
//      name: '(^^)'
//   },
//   id: '(^^)',
//   is_admin: '(^^)'
// }
```

## Links

- [API docs](https://ezylean.github.io/coerce-middleware)
- [Playground](https://npm.runkit.com/@ezy/coerce-middleware)
