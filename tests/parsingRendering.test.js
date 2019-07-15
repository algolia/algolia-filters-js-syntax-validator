import Parser from '../src/parser';

const parser = new Parser();

expect.extend({
  toHaveThisHtmlOutput(received, argument) {
    return {
      message: () => `expected ${received.html} got ${argument}`,
      pass: received.html === argument,
    };
  },
});

describe('Parser', () => {
  it('render spaces', () => {
    expect(parser.parse('num:123TO456')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">num</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">123TO456</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a\nAND\rb\tAND\fc AND d')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a\nAND\rb\tAND\fc</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">d</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse(' tag AND name : value AND num = 123 ')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"> </span><span class="token Token_String">tag</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">name</span><span class="token-spaces"> </span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"> </span><span class="token Token_String">value</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Operator">=</span><span class="token-spaces"> </span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('render empty strings', () => {
    expect(parser.parse(':value1 AND name2:value2')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Facet_Separator unexpected">:</span><span class="token-spaces"></span><span class="token Token_String">value1</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">name2</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value2</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name1: AND name2:value2')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name1</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"> </span><span class="token Token_AND unexpected">AND</span><span class="token-spaces"> </span><span class="token Token_String">name2</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value2</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"":value1 AND name2:value2')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Empty_Str unexpected">""</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value1</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">name2</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value2</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name1:"" AND name2:value2')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name1</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Empty_Str unexpected">""</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">name2</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value2</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('" ":value1 AND name2:value2')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">" "</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value1</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">name2</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value2</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name1:" " AND name2:value2')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name1</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">" "</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">name2</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value2</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('" "')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">" "</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('it parse escape character outside quotes', () => {
    expect(parser.parse('\\whatever\\')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\\whatever\\</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('\\name\\:\\value\\')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\\name\\</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">\\value\\</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('it parse escaped double quotes outside quotes', () => {
    expect(parser.parse('"unclosed')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Incomplete_Str unexpected">"unclosed</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"unclosed because escaped \\"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Incomplete_Str unexpected">"unclosed because escaped \\"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse('"unclosed with trailing backslash \\')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Incomplete_Str unexpected">"unclosed with trailing backslash \\</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a"b"c')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_String unexpected">"b"</span><span class="token-spaces"></span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"\\\\initial backslash"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"\\\\initial backslash"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"\\\\"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"\\\\"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"middle \\\\backslash"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"middle \\\\backslash"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"final backslash \\\\"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"final backslash \\\\"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"double quote = \\""')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"double quote = \\""</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"single quote = \'"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"single quote = \'"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"escaped single quote = \\\'"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"escaped single quote = \\\'"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"unknown = \\x"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"unknown = \\x"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"this is not a newline: \\n"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"this is not a newline: \\n"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse('"this is not a carriage return: \\r"')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"this is not a carriage return: \\r"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse('"this is not a tabulation: \\t"')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"this is not a tabulation: \\t"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a\\ AND b')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a\\</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a\\ AND\\ b')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a\\</span><span class="token-spaces"> </span><span class="token Token_String unexpected">AND\\</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('(a AND b\\)')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b\\</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name:"double quoted value"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">"double quoted value"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"double quoted name":value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"double quoted name"</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name:"value with: colon"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">"value with: colon"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"name with: colon":value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"name with: colon"</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('it parse escaped singe quote outside quotes', () => {
    expect(parser.parse("'unclosed")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Incomplete_Str unexpected">\'unclosed</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'unclosed because escaped \\'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Incomplete_Str unexpected">\'unclosed because escaped \\\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse("'unclosed with trailing backslash \\")
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Incomplete_Str unexpected">\'unclosed with trailing backslash \\</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("a'b'c")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_String unexpected">\'b\'</span><span class="token-spaces"></span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'\\\\initial backslash'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'\\\\initial backslash\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'\\\\'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'\\\\\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'middle \\\\backslash'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'middle \\\\backslash\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'final backslash \\\\'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'final backslash \\\\\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'double quote = \"'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'double quote = "\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'single quote = \\''")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'single quote = \\\'\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'escaped double quote = \\\"'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'escaped double quote = \\"\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'unknown = \\x'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'unknown = \\x\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("name:'single quoted value'")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">\'single quoted value\'</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse("'single quoted name':value")).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\'single quoted name\'</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('it parse case sensitive operator', () => {
    expect(parser.parse('NOT a')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('not a')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">not</span><span class="token-spaces"> </span><span class="token Token_String unexpected">a</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a AND b')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a and b')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_String unexpected">and</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a OR b')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a or b')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_String unexpected">or</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('num:123 TO 456')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">num</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_Range">TO</span><span class="token-spaces"> </span><span class="token Token_Num">456</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('num:123 to 456')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">num</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_String unexpected">to</span><span class="token-spaces"> </span><span class="token Token_Num">456</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('render range operator', () => {
    expect(parser.parse('num:123 TO 456')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">num</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_Range">TO</span><span class="token-spaces"> </span><span class="token Token_Num">456</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('render negation operator', () => {
    expect(parser.parse('NOT a')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT -a')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">-a</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT "quoted value"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">"quoted value"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT name:value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT name:-value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">-value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT name:"quoted value"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">"quoted value"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num = 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Operator">=</span><span class="token-spaces"> </span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num != 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Operator">!=</span><span class="token-spaces"> </span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num < 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"> </span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num <= 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Operator"><=</span><span class="token-spaces"> </span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num >= 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Operator">>=</span><span class="token-spaces"> </span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num > 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"> </span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT num:123 TO 456')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">num</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_Range">TO</span><span class="token-spaces"> </span><span class="token Token_Num">456</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('NOT(a OR b)')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"></span><span class="token Token_Open_Backet unexpected">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('render parenthesis', () => {
    expect(parser.parse('a AND b OR c')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('(a AND b) OR c')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR unexpected">OR</span><span class="token-spaces"> </span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a OR name:value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String unexpected">name</span><span class="token-spaces unexpected"></span><span class="token Token_Facet_Separator unexpected">:</span><span class="token-spaces unexpected"></span><span class="token Token_String unexpected unexpected">value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a OR num = 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String unexpected">num</span><span class="token-spaces unexpected"> </span><span class="token Token_Operator unexpected">=</span><span class="token-spaces unexpected"> </span><span class="token Token_Num unexpected unexpected">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name:value OR num = 666')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String unexpected">num</span><span class="token-spaces unexpected"> </span><span class="token Token_Operator unexpected">=</span><span class="token-spaces unexpected"> </span><span class="token Token_Num unexpected unexpected">666</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    // expect(parser.parse("(((a) OR (b)) AND (c))")).toHaveThisHtmlOutput('<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>');
    expect(
      parser.parse('(type:a OR type:b) AND NOT type:c AND NOT type:d')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">c</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">d</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    // expect(parser.parse("((type:a OR type:b) AND (NOT type:c)) AND (NOT type:d)")).toHaveThisHtmlOutput('<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">type</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">d</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>');
    expect(
      parser.parse('a OR b AND (tags:movie AND price:10 TO 20)')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">tags</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">movie</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">price</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Num">10</span><span class="token-spaces"> </span><span class="token Token_Range">TO</span><span class="token-spaces"> </span><span class="token Token_Num">20</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    // expect(parser.parse("(a OR b AND c) AND d AND e")).toHaveThisHtmlOutput('<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">d</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">e</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>');
    expect(
      parser.parse('(((tag1) OR tag2) OR name:value)')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">tag1</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">tag2</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String unexpected">name</span><span class="token-spaces unexpected"></span><span class="token Token_Facet_Separator unexpected">:</span><span class="token-spaces unexpected"></span><span class="token Token_String unexpected unexpected">value</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse('(tag1 OR (tag2 OR (name:value)))')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">tag1</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">tag2</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String unexpected">name</span><span class="token-spaces unexpected"></span><span class="token Token_Facet_Separator unexpected">:</span><span class="token-spaces unexpected"></span><span class="token Token_String unexpected unexpected">value</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(
      parser.parse('(((tag1 OR NOT tag2))) OR (name:value)')
    ).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">tag1</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_NOT">NOT</span><span class="token-spaces"> </span><span class="token Token_String">tag2</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String unexpected">name</span><span class="token-spaces unexpected"></span><span class="token Token_Facet_Separator unexpected">:</span><span class="token-spaces unexpected"></span><span class="token Token_String unexpected unexpected">value</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('(a AND b OR c) OR d')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"> </span><span class="token Token_OR unexpected">OR</span><span class="token-spaces"> </span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">d</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a OR (b OR c AND d)')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">b</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String">c</span><span class="token-spaces"> </span><span class="token Token_AND unexpected">AND</span><span class="token-spaces"> </span><span class="token Token_String">d</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('(a) OR (((b) OR (c)) AND (d))')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_AND unexpected">AND</span><span class="token-spaces"> </span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">d</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('((a AND b)) OR c')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_Open_Backet">(</span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_AND">AND</span><span class="token-spaces"> </span><span class="token Token_String">b</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"></span><span class="token Token_Close_Bracket">)</span><span class="token-spaces"> </span><span class="token Token_OR unexpected">OR</span><span class="token-spaces"> </span><span class="token Token_String">c</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('a=10 OR B')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_Operator">=</span><span class="token-spaces"></span><span class="token Token_Num">10</span><span class="token-spaces"> </span><span class="token Token_OR">OR</span><span class="token-spaces"> </span><span class="token Token_String unexpected unexpected">B</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('render facet score', () => {
    expect(parser.parse('a<score=789>')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"></span><span class="token Token_String">score</span><span class="token-spaces"></span><span class="token Token_Operator">=</span><span class="token-spaces"></span><span class="token Token_Num">789</span><span class="token-spaces"></span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse(' a < score = 789 > ')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"> </span><span class="token Token_String">a</span><span class="token-spaces"> </span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"> </span><span class="token Token_String">score</span><span class="token-spaces"> </span><span class="token Token_Operator">=</span><span class="token-spaces"> </span><span class="token Token_Num">789</span><span class="token-spaces"> </span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"> </span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name:value<score=789>')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_String">value</span><span class="token-spaces"></span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"></span><span class="token Token_String">score</span><span class="token-spaces"></span><span class="token Token_Operator">=</span><span class="token-spaces"></span><span class="token Token_Num">789</span><span class="token-spaces"></span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse(' name : value < score = 789 > ')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"> </span><span class="token Token_String">name</span><span class="token-spaces"> </span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"> </span><span class="token Token_String">value</span><span class="token-spaces"> </span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"> </span><span class="token Token_String">score</span><span class="token-spaces"> </span><span class="token Token_Operator">=</span><span class="token-spaces"> </span><span class="token Token_Num">789</span><span class="token-spaces"> </span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"> </span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('num < 123 <score=789>')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">num</span><span class="token-spaces"> </span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"> </span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_Open_Angled_Bracket unexpected"><</span><span class="token-spaces"></span><span class="token Token_String">score</span><span class="token-spaces"></span><span class="token Token_Operator">=</span><span class="token-spaces"></span><span class="token Token_Num">789</span><span class="token-spaces"></span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('num:123 TO 456<score=789>')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">num</span><span class="token-spaces"></span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"></span><span class="token Token_Num">123</span><span class="token-spaces"> </span><span class="token Token_Range">TO</span><span class="token-spaces"> </span><span class="token Token_Num">456</span><span class="token-spaces"></span><span class="token Token_Open_Angled_Bracket unexpected"><</span><span class="token-spaces"></span><span class="token Token_String">score</span><span class="token-spaces"></span><span class="token Token_Operator">=</span><span class="token-spaces"></span><span class="token Token_Num">789</span><span class="token-spaces"></span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );

    // NOT SUPPORTED YET BY THE ENGINE // epect(parser.parse(" a<score=666,score=777>")).toHaveThisHtmlOutput(');
    // NOT SUPPORTED YET BY THE ENGINE // epect(parser.parse(" a<score=666 ,score=777>")).toHaveThisHtmlOutput(');
    expect(parser.parse('a<unknown=666>')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">a</span><span class="token-spaces"></span><span class="token Token_Open_Angled_Bracket"><</span><span class="token-spaces"></span><span class="token Token_String unexpected">unknown</span><span class="token-spaces"></span><span class="token Token_Operator">=</span><span class="token-spaces"></span><span class="token Token_Num">666</span><span class="token-spaces"></span><span class="token Token_Close_Angled_Bracket">></span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });

  it('render filter with dash as initial value', () => {
    expect(parser.parse('-value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">-value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('"-value"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">"-value"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name : -value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"> </span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"> </span><span class="token Token_String">-value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name : "-value"')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"> </span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"> </span><span class="token Token_String">"-value"</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('\\-value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">\\-value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
    expect(parser.parse('name : \\-value')).toHaveThisHtmlOutput(
      '<span class="token First_Token"></span><span class="token-spaces"></span><span class="token Token_String">name</span><span class="token-spaces"> </span><span class="token Token_Facet_Separator">:</span><span class="token-spaces"> </span><span class="token Token_String">\\-value</span><span class="token-spaces"></span><span class="token Token_EOF">E</span><span class="token-spaces"></span>'
    );
  });
});
