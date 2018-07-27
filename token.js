function Token(type, string, raw_string, pos) {
    this.type = type;
    this.value = string;
    this.raw_value = raw_string === null ? this.value : raw_string;
    this.pos = pos;
    this.beforePos = pos;
    this.unexpectedMessage = '';

    this.tokensList = {
        Token_Empty_Str: "empty string",
        Token_Incomplete_Str: "incomplete string",
        Token_Error: "error",
        Token_Term: "filter",
        Token_String: "string",
        Token_Num: "numeric",
        Token_Facet_Separator: "':'",
        Token_Range: "'TO'",
        Token_Open_Backet: "'('",
        Token_Close_Bracket: "')'",
        Token_OR: "'OR'",
        Token_AND: "'AND'",
        Token_NOT: "'NOT'",
        Token_EOF: "end of filter",
        Token_Open_Angled_Bracket: "<",
        Token_Close_Angled_Bracket: ">",
        Token_Coma: ",",
        Token_Operator: "numeric operator",
        Term_Tag: 'tag filter',
        Term_Numeric: 'numeric filter',
        Term_Facet: 'tag filter'
    };

    this.toString = function () {
        return this.tokensList[this.type];
    };

    this.tokenToString = function (type) {
        return this.tokensList[type];
    };
}