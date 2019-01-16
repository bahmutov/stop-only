# stop-only

> Detects &#39;.only&#39; left in the code accidentally. Works with "describe", "context" and "it".

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![renovate-app badge][renovate-badge]][renovate-app]

## Install

Requires [Node](https://nodejs.org/en/), but this is a shell script.

```sh
npm install --save-dev stop-only
```

## Use

### basic

Assuming the tests are in the folder "specs", I recommend create an NPM run script. Use `--folder` or `-f` to pass the folder(s) to search.

```json
{
  "scripts": {
    "stop-only": "stop-only --folder specs --folder bin"
  }
}
```

Exits with 1 if there is ".only" somewhere in the files inside "specs" folder or inside "bin" folder.

### warn

If you just want to warn on found `.only`, use `stop-only --warn <folder>` syntax. Alias `-w`.

### exclude folders

If you need to exclude certain folders, use `--skip` or `-s` option.

```json
{
  "scripts": {
    "stop-only": "stop-only specs --skip node_modules"
  }
}
```

### exclude files

You can exclude files by name using `--exclude` or `-e` option.

```json
{
  "scripts": {
    "stop-only": "stop-only specs --exclude foo-spec.js"
  }
}
```

### Pre-commit or pre-push hook

If using [pre-git][pre-git] to configure Git hooks, run this tool as a command

```json
{
  "config": {
    "pre-git": {
      "pre-push": ["npm run stop-only"]
    }
  }
}
```

See [package.json](package.json) (note here we have just local script name).

**tip** you can warn on commit hook, while fail in pre-push hook.

[pre-git]: github.com/bahmutov/pre-git#readme

### Commas

You can pass multiple folder names as separate arguments or comma-separated. These are equivalent

```
stop-only --folder foo --folder bar --skip src --skip source
stop-only -f foo -f bar -s src -s source
stop-only -f foo,bar -s src,source
```

### Debugging

You can see additional diagnostic output from this command by running with environment variable `DEBUG=stop-only`

### CI

On CI run the tool after install, for example see [.travis.yml](.travis.yml),
(note here we have just local script name).

```
- npm run stop-only
```

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/stop-only/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/stop-only.svg?downloads=true
[npm-url]: https://npmjs.org/package/stop-only
[ci-image]: https://travis-ci.org/bahmutov/stop-only.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/stop-only
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
