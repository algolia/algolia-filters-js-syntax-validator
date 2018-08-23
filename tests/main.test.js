import Parser from '../src/parser';

describe('Parser', () => {
  it('rollupJestBoilerplate(string)', () => {
    expect(new Parser('A').parse().tokens.length).toEqual(2);
  });
});
