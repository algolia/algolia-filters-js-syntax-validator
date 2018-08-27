# Algolia filters JS syntax validator

This package implements the parsing logic of filters of the Algolia search engine in JavaScript.
On top of this it renders HTML to allow to have a visual output. This is especially useful when
there is an error in the output.

## Table of content

  * [How to install](#how-to-install)
    + [CDN](#cdn)
    + [Yarn](#yarn)
  * [How to use](#how-to-use)
  * [Example of `response` object](#example-of--response--object)
    + [CSS Classes](#css-classes)
  * [Contributing](#contributing)
    + [Launch the dev environment](#launch-the-dev-environment)
    + [Run the tests](#run-the-tests)
    + [The code contribution process](#the-code-contribution-process)

## How to install

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/algolia-filters-js-syntax-validator@1.0.0"></script>
```

### Yarn

```js
// `npm install algolia-filters-js-syntax-validator --save` OR// ` 
// `yarn add algolia-filters-js-syntax-validator`

const Parser = require('algolia-filters-js-syntax-validator');
```

## How to use

```js
const parser = new Parser();
const response = parser.parse('A OR B');
```

The `response` object will contain 3 attributes:

- `response.html`: contains the html containing span elements.
Each span has classes that can be used to add color to each tokens.
In most cases you will just display this string.
- `response.errorMessage`:
    - if the input is not valid: string containing the error message
    - if the input is valid: empty string
- `response.tokens`: the list of tokens. can be used for advanced display in case `response.html` does not fit the need.
    - `type`: Type of the token
    - `value`: value of the token
    - `raw_value`: same as `value` but contains quotes (if present) for string types.
    - `pos`: position of the token in the input 
    - `errorStart`: whether an error starts at this token
    - `errorStop`: whether an error ends at this token
    - `unexpectedMessage`: contains an error message if the token is not expected
    - `afterSeparators`: string containing spaces present before the next token
    - `cssClasses`: list of cssClasses to be applied to the token span
    - `afterSeparatorsCssClasses`: list of cssClasses to be applied to the spaces span

## Example of `response` object

```json
{
   "html":"<span class=\"token First_Token\"></span><span class=\"token-spaces\">[...]",
   "errorMessage":"",
   "tokens":[
      {
         "type":"First_Token",
         "value":"",
         "raw_value":"",
         "pos":0,
         "errorStart":false,
         "errorStop":false,
         "unexpectedMessage":"",
         "afterSeparators":"",
         "cssClasses":[
            "token",
            "First_Token"
         ],
         "afterSeparatorsCssClasses":[
            "token-spaces"
         ]
      },
      [...]
   ]
}
```

### CSS Classes

Type of span:
- `token`
- `token-spaces`

Status:
- `unexpected`

Tokens:
- `Token_OR`
- `Token_AND`
- `Token_NOT`
- `Token_Range`
- `Token_Num`
- `Token_Empty_Str`
- `Token_String`
- `Token_Incomplete_Str`
- `Token_Operator`
- `Token_Open_Angled_Bracket`
- `Token_Close_Angled_Bracket`
- `Token_Error`
- `Token_Open_Backet`
- `Token_Close_Bracket`
- `Token_Facet_Separator`
- `Token_Coma`
- `Token_Error`
- `Token_EOF`

## Contributing

### Launch the dev environment

```bash
yarn
yarn watch
```

You can test the output by opening `dev/index.html` in your web browser

### Run the tests

```bash
yarn test
```

### The code contribution process

On your side:

- Fork and clone the project
- Create a new branch for what you want to solve
- Make your changes
- Open a pull request on the `develop` branch

Then:

- Peer review of the pull request (by at least one of the core contributors)
- Automatic tests
- When everything is green, your contribution is merged 🚀