export default class Token {
  constructor(type, string, rawString, pos) {
    this.type = type;
    this.value = string;
    this.raw_value = rawString === null ? this.value : rawString;
    this.pos = pos;
    this.errorStart = false;
    this.errorStop = false;
    this.unexpectedMessage = '';
    this.afterSeparators = '';
    this.cssClasses = ['token', this.type];
    this.afterSeparatorsCssClasses = ['token-spaces'];

    this.tokensList = {
      Token_Empty_Str: 'empty string',
      Token_Incomplete_Str: 'incomplete string',
      Token_Error: '!',
      Token_Term: 'filter',
      Token_String: 'string',
      Token_Num: 'numeric',
      Token_Facet_Separator: "':'",
      Token_Range: "'TO'",
      Token_Open_Backet: "'('",
      Token_Close_Bracket: "')'",
      Token_OR: "'OR'",
      Token_AND: "'AND'",
      Token_NOT: "'NOT'",
      Token_EOF: 'end of filter',
      Token_Open_Angled_Bracket: '<',
      Token_Close_Angled_Bracket: '>',
      Token_Coma: ',',
      Token_Operator: 'numeric operator',
      Term_Tag: 'tag filter',
      Term_Numeric: 'numeric filter',
      Term_Facet: 'tag filter',
    };
  }

  toString() {
    return this.tokensList[this.type];
  }

  tokenToString(type) {
    return this.tokensList[type];
  }
}
