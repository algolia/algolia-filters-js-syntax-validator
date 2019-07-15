import Token from './token';

export default class Lexer {
  constructor() {
    this.tokens = [];
    this.currentPos = 0;
    this.lastToken = null;
  }

  get(i) {
    if (i === undefined) i = 0;
    if (this.currentPos + i >= this.tokens.length)
      return this.tokens[this.tokens.length - 1];
    return this.tokens[this.currentPos + i];
  }

  next() {
    if (this.currentPos > this.tokens.length) {
      return null;
    }

    this.currentPos++;
  }

  isSeparator(c) {
    return (
      c === ' ' ||
      c === '(' ||
      c === ')' ||
      c === '<' ||
      c === '>' ||
      c === '=' ||
      c === '!' ||
      c === ':' ||
      c === "'" ||
      c === '"'
    );
  }

  readTokenValue(s, i) {
    let onlyNum = true;
    let nbDot = 0;
    let startPos;

    for (
      startPos = i;
      startPos < s.length && !this.isSeparator(s[startPos]);
      startPos++
    ) {
      onlyNum =
        onlyNum &&
        ((s[startPos] >= '0' && s[startPos] <= '9') ||
          (startPos === i && s[startPos] === '-') ||
          (startPos > i && s[startPos] === '.' && ++nbDot === 1));
    }

    if (startPos - i === 2 && s[i + 0] === 'O' && s[i + 1] === 'R') {
      return new Token('Token_OR', s.substr(i, startPos - i), null, i);
    } else if (startPos - i === 2 && s[i + 0] === 'T' && s[i + 1] === 'O') {
      return new Token('Token_Range', s.substr(i, startPos - i), null, i);
    } else if (
      startPos - i === 3 &&
      s[i + 0] === 'N' &&
      s[i + 1] === 'O' &&
      s[i + 2] === 'T'
    ) {
      return new Token('Token_NOT', s.substr(i, startPos - i), null, i);
    } else if (
      startPos - i === 3 &&
      s[i + 0] === 'A' &&
      s[i + 1] === 'N' &&
      s[i + 2] === 'D'
    ) {
      return new Token('Token_AND', s.substr(i, startPos - i), null, i);
    } else {
      return new Token(
        onlyNum ? 'Token_Num' : 'Token_String',
        s.substr(i, startPos - i),
        null,
        i
      );
    }
  }

  readQuotedString(s, i) {
    const quoteType = s[i];
    let escape = false;
    let startPos;

    for (startPos = i + 1; startPos < s.length; startPos++) {
      if (s[startPos] === quoteType && !escape) {
        if (startPos - i <= 1) {
          // ""
          return new Token(
            'Token_Empty_Str',
            quoteType + quoteType,
            null,
            startPos
          );
        } else {
          return new Token(
            'Token_String',
            s.substr(i + 1, startPos - i - 1),
            s.substr(i, startPos - i + 1),
            i
          );
        }
      }

      if (s[startPos] === '\\') {
        escape = !escape;
      } else {
        escape = false;
      }
    }

    return new Token(
      'Token_Incomplete_Str',
      s.substr(i + 1, startPos - i),
      s.substr(i, startPos - i),
      i
    );
  }

  readToken(s, i) {
    if (s[i] === '=') {
      return new Token('Token_Operator', '=', null, i);
    } else if (s[i] === '<') {
      // < or <=
      if (s.length > i + 1 && s[i + 1] === '=')
        return new Token('Token_Operator', '<=', null, i);
      return new Token('Token_Open_Angled_Bracket', '<', null, i);
    } else if (s[i] === '>') {
      // > or >=
      if (s.length > i + 1 && s[i + 1] === '=')
        return new Token('Token_Operator', '>=', null, i);
      return new Token('Token_Close_Angled_Bracket', '>', null, i);
    } else if (s[i] === '!') {
      // !=
      if (s.length > i + 1 && s[i + 1] === '=')
        return new Token('Token_Operator', '!=', null, i);
      return new Token('Token_Error', s[i], null, i);
    } else if (s[i] === '(') {
      return new Token('Token_Open_Backet', '(', null, i);
    } else if (s[i] === ')') {
      return new Token('Token_Close_Bracket', ')', null, i);
    } else if (s[i] === ':') {
      return new Token('Token_Facet_Separator', ':', null, i);
    } else if (s[i] === ',') {
      return new Token('Token_Coma', ',', null, i);
    } else if (s[i] === '"' || s[i] === "'") {
      return this.readQuotedString(s, i);
    } else {
      return this.readTokenValue(s, i); // STRING, NUM OR or AND
    }
  }

  addToken(token) {
    this.tokens.push(token);
    this.lastToken = token;
  }

  lex(s) {
    let i = 0;
    this.addToken(new Token('First_Token', '', null, 0));

    while (i < s.length && s[i] === ' ') {
      this.lastToken.afterSeparators += s[i];
      i++;
    }

    while (i < s.length) {
      const token = this.readToken(s, i);
      this.addToken(token);

      if (token.type === 'Token_Error') {
        token.afterSeparators = s.substr(i + 1, s.length - i);
        this.currentPos = this.tokens.length - 1;
        return false;
      }
      i += token.raw_value.length;

      while (i < s.length && s[i] === ' ') {
        this.lastToken.afterSeparators += s[i];
        i++;
      }
    }
    this.addToken(new Token('Token_EOF', 'E', null, s.length));

    return true;
  }
}
