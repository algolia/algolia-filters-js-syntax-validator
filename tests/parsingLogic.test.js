import Parser from '../src/parser';

const parser = new Parser();

expect.extend({
  toBeValid(received) {
    return {
      message: () => `expected ${received} to be a valid filter`,
      pass: received.errorMessage.length === 0,
    };
  },
  toBeInvalidWith(received, argument) {
    return {
      message: () =>
        `expected ${received} to be a invalid filter and fails with: "${argument}" got "${received.errorMessage}"`,
      pass:
        received.errorMessage.length > 0 && received.errorMessage === argument,
    };
  },
});

describe('Parser', () => {
  it('parse spaces', () => {
    expect(parser.parse('num:123TO456')).toBeValid();
    expect(parser.parse('a\nAND\rb\tAND\fc AND d')).toBeValid();
    expect(parser.parse(' tag AND name : value AND num = 123 ')).toBeValid();
  });

  it('parse empty strings', () => {
    expect(parser.parse(':value1 AND name2:value2')).toBeInvalidWith(
      "Unexpected token ':' expected filter at col 0"
    );
    expect(parser.parse('name1: AND name2:value2')).toBeInvalidWith(
      "Unexpected token 'AND' expected string at col 7"
    );
    expect(parser.parse('"":value1 AND name2:value2')).toBeInvalidWith(
      'Unexpected token empty string expected filter at col 1'
    );
    expect(parser.parse('name1:"" AND name2:value2')).toBeInvalidWith(
      'Unexpected token empty string expected string at col 7'
    );
    expect(parser.parse('" ":value1 AND name2:value2')).toBeValid();
    expect(parser.parse('name1:" " AND name2:value2')).toBeValid();
    expect(parser.parse('" "')).toBeValid();
  });

  it('it parse escape character outside quotes', () => {
    expect(parser.parse('\\whatever\\')).toBeValid();
    expect(parser.parse('\\name\\:\\value\\')).toBeValid();
  });

  it('it parse escaped double quotes outside quotes', () => {
    expect(parser.parse('"unclosed')).toBeInvalidWith(
      'Unexpected token incomplete string expected filter at col 0'
    );
    expect(parser.parse('"unclosed because escaped \\"')).toBeInvalidWith(
      'Unexpected token incomplete string expected filter at col 0'
    );
    expect(
      parser.parse('"unclosed with trailing backslash \\')
    ).toBeInvalidWith(
      'Unexpected token incomplete string expected filter at col 0'
    );
    expect(parser.parse('a"b"c')).toBeInvalidWith(
      'Unexpected token string(b) expected end of filter at col 1'
    );
    expect(parser.parse('"\\\\initial backslash"')).toBeValid();
    expect(parser.parse('"\\\\"')).toBeValid();
    expect(parser.parse('"middle \\\\backslash"')).toBeValid();
    expect(parser.parse('"final backslash \\\\"')).toBeValid();
    expect(parser.parse('"double quote = \\""')).toBeValid();
    expect(parser.parse('"single quote = \'"')).toBeValid();
    expect(parser.parse('"escaped single quote = \\\'"')).toBeValid();
    expect(parser.parse('"unknown = \\x"')).toBeValid();
    expect(parser.parse('"this is not a newline: \\n"')).toBeValid();
    expect(parser.parse('"this is not a carriage return: \\r"')).toBeValid();
    expect(parser.parse('"this is not a tabulation: \\t"')).toBeValid();
    expect(parser.parse('a\\ AND b')).toBeValid();
    expect(parser.parse('a\\ AND\\ b')).toBeInvalidWith(
      'Unexpected token string(AND\\) expected end of filter at col 3'
    );
    expect(parser.parse('(a AND b\\)')).toBeValid();
    expect(parser.parse('name:"double quoted value"')).toBeValid();
    expect(parser.parse('"double quoted name":value')).toBeValid();
    expect(parser.parse('name:"value with: colon"')).toBeValid();
    expect(parser.parse('"name with: colon":value')).toBeValid();
  });

  it('it parse escaped singe quote outside quotes', () => {
    expect(parser.parse("'unclosed")).toBeInvalidWith(
      'Unexpected token incomplete string expected filter at col 0'
    );
    expect(parser.parse("'unclosed because escaped \\'")).toBeInvalidWith(
      'Unexpected token incomplete string expected filter at col 0'
    );
    expect(
      parser.parse("'unclosed with trailing backslash \\")
    ).toBeInvalidWith(
      'Unexpected token incomplete string expected filter at col 0'
    );
    expect(parser.parse("a'b'c")).toBeInvalidWith(
      'Unexpected token string(b) expected end of filter at col 1'
    );
    expect(parser.parse("'\\\\initial backslash'")).toBeValid();
    expect(parser.parse("'\\\\'")).toBeValid();
    expect(parser.parse("'middle \\\\backslash'")).toBeValid();
    expect(parser.parse("'final backslash \\\\'")).toBeValid();
    expect(parser.parse("'double quote = \"'")).toBeValid();
    expect(parser.parse("'single quote = \\''")).toBeValid();
    expect(parser.parse("'escaped double quote = \\\"'")).toBeValid();
    expect(parser.parse("'unknown = \\x'")).toBeValid();
    expect(parser.parse("name:'single quoted value'")).toBeValid();
    expect(parser.parse("'single quoted name':value")).toBeValid();
  });

  it('it parse case sensitive operator', () => {
    expect(parser.parse('NOT a')).toBeValid();
    expect(parser.parse('not a')).toBeInvalidWith(
      'Unexpected token string(a) expected end of filter at col 4'
    );
    expect(parser.parse('a AND b')).toBeValid();
    expect(parser.parse('a and b')).toBeInvalidWith(
      'Unexpected token string(and) expected end of filter at col 2'
    );
    expect(parser.parse('a OR b')).toBeValid();
    expect(parser.parse('a or b')).toBeInvalidWith(
      'Unexpected token string(or) expected end of filter at col 2'
    );
    expect(parser.parse('num:123 TO 456')).toBeValid();
    expect(parser.parse('num:123 to 456')).toBeInvalidWith(
      'Unexpected token string(to) expected end of filter at col 8'
    );
  });

  it('parse range operator', () => {
    expect(parser.parse('num:123 TO 456')).toBeValid();
  });

  it('parse negation operator', () => {
    expect(parser.parse('NOT a')).toBeValid();
    expect(parser.parse('NOT -a')).toBeValid();
    expect(parser.parse('NOT "quoted value"')).toBeValid();
    expect(parser.parse('NOT name:value')).toBeValid();
    expect(parser.parse('NOT name:-value')).toBeValid();
    expect(parser.parse('NOT name:"quoted value"')).toBeValid();
    expect(parser.parse('NOT num = 666')).toBeValid();
    expect(parser.parse('NOT num != 666')).toBeValid();
    expect(parser.parse('NOT num < 666')).toBeValid();
    expect(parser.parse('NOT num <= 666')).toBeValid();
    expect(parser.parse('NOT num >= 666')).toBeValid();
    expect(parser.parse('NOT num > 666')).toBeValid();
    expect(parser.parse('NOT num:123 TO 456')).toBeValid();
    expect(parser.parse('NOT(a OR b)')).toBeInvalidWith(
      "Unexpected token '(' expected filter at col 3"
    );
  });

  it('parse parenthesis', () => {
    expect(parser.parse('a AND b OR c')).toBeValid();
    expect(parser.parse('(a AND b) OR c')).toBeInvalidWith(
      'filter (X AND Y) OR Z is not allowed, only (X OR Y) AND Z is allowed'
    );
    expect(parser.parse('a OR name:value')).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a tag filter which needs to have this form:\n - _tags:tag_value\n - tag_value'
    );
    expect(parser.parse('a OR num = 666')).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a tag filter which needs to have this form:\n - _tags:tag_value\n - tag_value'
    );
    expect(parser.parse('name:value OR num = 666')).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a facet filter which needs to have this form:\n - facet_name:facet_value'
    );
    // NOT YET VALID //expect(parser.parse("(((a) OR (b)) AND (c))")).toBeValid();
    expect(
      parser.parse('(type:a OR type:b) AND NOT type:c AND NOT type:d')
    ).toBeValid();
    // NOT YET VALID //expect(parser.parse("((type:a OR type:b) AND (NOT type:c)) AND (NOT type:d)")).toBeValid();
    expect(
      parser.parse('a OR b AND (tags:movie AND price:10 TO 20)')
    ).toBeValid();
    // NOT YET VALID //expect(parser.parse("(a OR b AND c) AND d AND e")).toBeValid();
    expect(parser.parse('(((tag1) OR tag2) OR name:value)')).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a tag filter which needs to have this form:\n - _tags:tag_value\n - tag_value'
    );
    expect(parser.parse('(tag1 OR (tag2 OR (name:value)))')).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a tag filter which needs to have this form:\n - _tags:tag_value\n - tag_value'
    );
    expect(
      parser.parse('(((tag1 OR NOT tag2))) OR (name:value)')
    ).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a tag filter which needs to have this form:\n - _tags:tag_value\n - tag_value'
    );
    expect(parser.parse('(a AND b OR c) OR d')).toBeInvalidWith(
      'filter (X AND Y) OR Z is not allowed, only (X OR Y) AND Z is allowed'
    );
    expect(parser.parse('a OR (b OR c AND d)')).toBeInvalidWith(
      'filter (X AND Y) OR Z is not allowed, only (X OR Y) AND Z is allowed'
    );
    expect(parser.parse('(a) OR (((b) OR (c)) AND (d))')).toBeInvalidWith(
      'filter (X AND Y) OR Z is not allowed, only (X OR Y) AND Z is allowed'
    );
    expect(parser.parse('((a AND b)) OR c')).toBeInvalidWith(
      'filter (X AND Y) OR Z is not allowed, only (X OR Y) AND Z is allowed'
    );
    expect(parser.parse('a=10 OR B')).toBeInvalidWith(
      'Different types are not allowed in the same OR.\nExpected a numeric filter which needs to have one of the following form:\n - numeric_attr_name=10\n - numeric_attr_name>10\n - numeric_attr_name>=10\n - numeric_attr_name<10\n - numeric_attr_name<=10\n - numeric_attr_name!=10\n - numeric_attr_name:10 TO 20'
    );
  });

  it('parse facet score', () => {
    expect(parser.parse('a<score=789>')).toBeValid();
    expect(parser.parse(' a < score = 789 > ')).toBeValid();
    expect(parser.parse('name:value<score=789>')).toBeValid();
    expect(parser.parse(' name : value < score = 789 > ')).toBeValid();
    expect(parser.parse('num < 123 <score=789>')).toBeInvalidWith(
      'Unexpected token < expected end of filter at col 10'
    );
    expect(parser.parse('num:123 TO 456<score=789>')).toBeInvalidWith(
      'Unexpected token < expected end of filter at col 14'
    );

    // NOT SUPPORTED YET BY THE ENGINE // expect(parser.parse(" a<score=666,score=777>")).toBeValid();
    // NOT SUPPORTED YET BY THE ENGINE // expect(parser.parse(" a<score=666 ,score=777>")).toBeValid();
    expect(parser.parse('a<unknown=666>')).toBeInvalidWith(
      'Unexpected token string(unknown) expected numeric at col 2'
    );
  });

  it('parse filter with dash as initial value', () => {
    expect(parser.parse('-value')).toBeValid();
    expect(parser.parse('"-value"')).toBeValid();
    expect(parser.parse('name : -value')).toBeValid();
    expect(parser.parse('name : "-value"')).toBeValid();
    expect(parser.parse('\\-value')).toBeValid();
    expect(parser.parse('name : \\-value')).toBeValid();
  });

  it('parse highlighted numeric filters', () => {
    const parserWithHighlight = new Parser({ withHighlight: true });

    expect(parserWithHighlight.parse('price > 50')).toBeValid();
    expect(parserWithHighlight.parse('price > <b>42</b>')).toBeValid();
    expect(parserWithHighlight.parse('price > <b>50</b>42')).toBeValid();
    expect(parserWithHighlight.parse('price > <b>50.3</b>42')).toBeValid();
  });
});
