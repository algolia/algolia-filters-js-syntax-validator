import Lexer from './lexer';

export default class Parser {
  constructor(options = { withHighlight: false }) {
    this.withHighlight = options.withHighlight;
  }

  parse(s) {
    this.lexer = new Lexer({ withHighlight: this.withHighlight });
    this.termType = 'Term_None';
    this.firstTermToken = null;
    this.tags = [];
    this.numericsFilters = [];
    this.facetFilters = [];
    this.groups = [];
    this.foundAND = false;
    this.foundOR = false;

    const response = {
      html: '',
      errorMessage: '',
    };

    if (s.length === 0) {
      return response;
    }

    if (this.lexer.lex(s) === false) {
      response.errorMessage = `Not allowed ${this.lexer
        .get(0)
        .toString()} at col ${this.lexer.get(0).pos}`;
    }

    this.lexer.next(); // Skip First_Token

    if (this.parseAnd()) {
      if (this.lexer.get().type !== 'Token_EOF') {
        this.unexpectedToken(this.lexer.get(), 'Token_EOF');
      }
    }

    let isValid = true;
    response.tokens = this.lexer.tokens.map(function(token) {
      if (token.errorStart || !isValid) {
        isValid = false;
        token.cssClasses.push('unexpected');
      }

      if (token.errorStop) {
        token.cssClasses.push('unexpected');
        isValid = true;
      }

      if (!isValid) token.afterSeparatorsCssClasses.push('unexpected');
      if (token.unexpectedMessage)
        response.errorMessage = token.unexpectedMessage;

      response.html += `<span class="${token.cssClasses.join(' ')}">${
        token.raw_value
      }</span><span class="${token.afterSeparatorsCssClasses.join(' ')}">${
        token.afterSeparators
      }</span>`;

      return token;
    });

    return response;
  }

  error(token, errorMessage) {
    token.unexpectedMessage = errorMessage;
    token.errorStop = true;
  }

  unexpectedToken(token, expected) {
    let errorMessage = `Unexpected token ${token.toString()}`;

    if (
      token.value.length > 0 &&
      (token.type === 'Token_String' || token.type === 'Token_Num')
    ) {
      errorMessage += `(${token.value.replace(/\n/g, '\u21b5')})`;
    }

    errorMessage += ` expected ${token.tokenToString(expected)} at col ${
      token.pos
    }`;

    this.error(token, errorMessage);
  }

  parseIntermediate(parseAnd) {
    let previousType = this.termType; // Store the previous type for A OR (B OR C)
    if (this.parseTerm()) {
      do {
        if (
          this.foundOR &&
          previousType !== 'Term_None' &&
          this.termType !== previousType
        ) {
          // Different type in a OR
          this.firstTermToken.errorStart = true;
          this.error(this.lexer.get(-1), this.getSameOrError(previousType));
          return false;
        }
        previousType = this.termType;
        if (
          this.lexer.get().type !== 'Token_OR' &&
          (!parseAnd || this.lexer.get().type !== 'Token_AND')
        ) {
          break;
        }
        if (this.lexer.get().type === 'Token_AND') {
          this.foundAND = true;
        } else {
          this.foundOR = true;
        }
        if (this.foundOR && this.foundAND) {
          this.error(
            this.lexer.get(),
            'filter (X AND Y) OR Z is not allowed, only (X OR Y) AND Z is allowed'
          );
          return false;
        }
        this.lexer.next();
        if (!this.parseTerm()) {
          // TERM OR ...
          return false;
        }
      } while (true);
      return true;
    } else {
      return false;
    }
  }

  parseAnd() {
    this.termType = 'Term_None';
    this.foundOR = false;
    this.foundAND = false;

    if (this.parseIntermediate(false)) {
      do {
        if (this.lexer.get().type !== 'Token_AND') {
          break;
        }

        this.lexer.next();
        this.termType = 'Term_None';
        this.foundOR = false;
        this.foundAND = false;

        if (!this.parseIntermediate(false)) {
          // TERM AND ...
          return false;
        }
      } while (true);
      return true;
    } else {
      return false;
    }
  }

  getSameOrError(expectedType) {
    let errorMessage = 'Different types are not allowed in the same OR.';

    if (expectedType === 'Term_Numeric') {
      errorMessage +=
        '\nExpected a numeric filter which needs to have one of the following form:';
      errorMessage += '\n - numeric_attr_name=10';
      errorMessage += '\n - numeric_attr_name>10';
      errorMessage += '\n - numeric_attr_name>=10';
      errorMessage += '\n - numeric_attr_name<10';
      errorMessage += '\n - numeric_attr_name<=10';
      errorMessage += '\n - numeric_attr_name!=10';
      errorMessage += '\n - numeric_attr_name:10 TO 20';
    } else if (expectedType === 'Term_Facet') {
      errorMessage +=
        '\nExpected a facet filter which needs to have this form:';
      errorMessage += '\n - facet_name:facet_value';
    } else if (expectedType === 'Term_Tag') {
      errorMessage += '\nExpected a tag filter which needs to have this form:';
      errorMessage += '\n - _tags:tag_value';
      errorMessage += '\n - tag_value';
    }

    return errorMessage;
  }

  parseTerm() {
    const score = 1;
    if (this.lexer.get().type === 'Token_Open_Backet') {
      // ()
      this.lexer.next();
      if (!this.parseIntermediate(true)) return false;

      if (this.lexer.get().type !== 'Token_Close_Bracket') {
        this.unexpectedToken(this.lexer.get(), 'Token_Close_Bracket');
        return false;
      }

      this.lexer.next();
      return true;
    }
    this.termType = 'Term_None';

    let negative = false;
    if (this.lexer.get().type === 'Token_NOT') {
      this.lexer.next();
      negative = true;
    }
    if (
      this.lexer.get().type === 'Token_String' ||
      this.lexer.get().type === 'Token_Num'
    ) {
      // TAG or FACET or NUM
      this.firstTermToken = this.lexer.get();
      const attributeNameToken = this.lexer.get();
      this.lexer.next();
      if (
        this.lexer.get().type === 'Token_Operator' ||
        this.lexer.get().type === 'Token_Open_Angled_Bracket' ||
        this.lexer.get().type === 'Token_Close_Angled_Bracket'
      ) {
        // NUM
        const operatorToken = this.lexer.get();
        if (
          this.lexer.get().type === 'Token_Open_Angled_Bracket' &&
          this.isOption(this.lexer.get(1))
        ) {
          // Tag with options
          if (!this.parseOptions(score)) return false;
          this.tags.push(`${attributeNameToken.value}<${score}>`);
          return true;
        }
        this.lexer.next();
        if (this.lexer.get().type !== 'Token_Num') {
          this.unexpectedToken(this.lexer.get(), 'Token_Num');
          return false;
        }
        const valToken = this.lexer.get();
        this.lexer.next();
        this.termType = 'Term_Numeric';
        if (negative) {
          this.negateOperator(operatorToken);
        }
        this.numericsFilters.push(
          `${attributeNameToken.value} ${operatorToken.value} ${valToken.value}`
        );
        return true;
      } else if (this.lexer.get().type === 'Token_Facet_Separator') {
        // Facet or Range
        this.lexer.next();
        if (
          this.lexer.get().type !== 'Token_String' &&
          this.lexer.get().type !== 'Token_Num'
        ) {
          this.unexpectedToken(this.lexer.get(), 'Token_String');
          return false;
        }
        const valToken = this.lexer.get();
        this.lexer.next();
        if (
          valToken.type === 'Token_Num' &&
          this.lexer.get().type === 'Token_Range'
        ) {
          // Range
          this.lexer.next(); // TO
          if (this.lexer.get().type !== 'Token_Num') {
            this.unexpectedToken(this.lexer.get(), 'Token_Num');
            return false;
          }

          // TODO handle negative
          this.numericsFilters.push(
            `${attributeNameToken.value}:${valToken.value} TO ${
              this.lexer.get().value
            }`
          );
          this.lexer.next();
          this.termType = 'Term_Numeric';
          return true;
        }
        const isTag = attributeNameToken.value === '_tags';
        this.termType = isTag ? 'Term_Tag' : 'Term_Facet';
        if (!this.parseOptions(score)) return false;

        if (negative) {
          if (isTag) {
            this.tags.push(`-${valToken.value}<${score}>`);
          } else {
            this.facetFilters.push(
              `-${attributeNameToken.value}:${valToken.value}<${score}>`
            );
          }
        } else if (valToken.value[0] === '-' || valToken.value[0] === '\\') {
          if (isTag) {
            this.tags.push(`\\${valToken.value}<${score}>`);
          } else {
            this.facetFilters.push(
              `\\${attributeNameToken.value}:${valToken.value}<${score}>`
            );
          }
        } else if (isTag) {
          this.tags.push(`${valToken.value}<${score}>`);
        } else {
          this.facetFilters.push(
            `${attributeNameToken.value}:${valToken.value}<${score}>`
          );
        }
        return true;
      }
      // Tag without options
      if (negative) {
        this.tags.push(`-${attributeNameToken.value}<${score}>`);
      } else if (
        attributeNameToken.value[0] === '-' ||
        attributeNameToken.value[0] === '\\'
      ) {
        this.tags.push(`\\${attributeNameToken.value}<${score}>`);
      } else {
        this.tags.push(`${attributeNameToken.value}<${score}>`);
      }
      this.termType = 'Term_Tag';
      return true;
    }
    this.unexpectedToken(this.lexer.get(), 'Token_Term');
    return false;
  }

  parseOptions(score) {
    if (this.lexer.get().type !== 'Token_Open_Angled_Bracket') {
      // The options for a filter are optional
      return true;
    }
    this.lexer.next();
    let hasNext = true;
    do {
      if (!this.parseOption(score)) {
        return false;
      }
      hasNext = false;
      if (this.lexer.get().type === 'Token_Coma') {
        hasNext = true;
      }
    } while (hasNext);
    if (this.lexer.get().type !== 'Token_Close_Angled_Bracket') {
      this.unexpectedToken(this.lexer.get(), 'Token_Close_Angled_Bracket');
    }
    this.lexer.next();
    return true;
  }

  parseOption(score) {
    if (this.lexer.get().type !== 'Token_String') {
      this.unexpectedToken(this.lexer.get(), 'Token_String');
      return false;
    }

    const optionNameToken = this.lexer.get();
    this.lexer.next();
    if (optionNameToken.value === 'score') {
      if (
        this.lexer.get().type !== 'Token_Operator' ||
        this.lexer.get().value !== '='
      ) {
        this.unexpectedToken(this.lexer.get(), '\\"=\\"');
        return false;
      }
      this.lexer.next();
      if (this.lexer.get().type !== 'Token_Num') {
        this.unexpectedToken(this.lexer.get(), 'Token_Num');
        return false;
      }
      const newScore = this.lexer.get().value;
      this.lexer.next();
      return newScore;
    } else {
      this.unexpectedToken(optionNameToken, '\\"score\\"');
      return false;
    }
  }

  negateOperator(operatorToken) {}

  isOption(token) {
    return token.value === 'score';
  }
}
