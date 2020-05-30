import parser from './parser';
import { renderIntoDocument } from '../tests/utils/dom-render';

const setup = () => {
  return renderIntoDocument(`
    <div>
      <button>btn1</button>
      <button>btn2</button>
      <span>I'm a label</span>
      <input placeholder="I'm a placeholder" />
    </div>`);
};
describe('parser', () => {
  it('should parse query successfully', () => {
    const container = setup();
    const result = parser.parse({
      htmlRoot: container,
      js: 'screen.getByText("I\'m a label")',
    });
    expect(result).toMatchSnapshot();
  });

  it('should give an error if the query is not valid', () => {
    const container = setup();
    const result = parser.parse({ htmlRoot: container, js: 'invalidquery' });
    expect(result.error).toBeDefined();
    expect(result.errorBody).toBeDefined();
  });

  it('should return targets as array', () => {
    const container = setup();
    let result = parser.parse({
      htmlRoot: container,
      js: "screen.getAllByRole('button')",
    });
    expect(result.targets).toBeArray();
    expect(result.targets).toHaveLength(2);
    result = parser.parse({
      htmlRoot: container,
      js: 'screen.getByText("I\'m a label")',
    });
    expect(result.targets).toBeArray();
    expect(result.targets).toHaveLength(1);
  });

  it('should return getByPlaceholderText as expression because is the last one in the sentence', () => {
    const container = setup();
    let result = parser.parse({
      htmlRoot: container,
      js: `screen.getAllByRole('button');
        screen.getByPlaceholderText("I'm a placeholder");`,
    });
    expect(result.expression).toMatchSnapshot();
  });

  it('should remove all comments from parsed expression', () => {
    const container = setup();
    let result = parser.parse({
      htmlRoot: container,
      js: `
      // comment1
      /*
      comment2
      */
      getByRole('button');`,
    });
    expect(result.expression).toMatchSnapshot();
  });

  it('should remove all spaces outside of quotes/tick/single quote', () => {
    const container = setup();
    let result = parser.parse({
      htmlRoot: container,
      js: ` get ByRol e('button');`,
    });
    expect(result.expression.expression).toEqual("getByRole('button')");

    result = parser.parse({
      htmlRoot: container,
      js: ` get ByRol e("button");`,
    });
    expect(result.expression.expression).toEqual('getByRole("button")');

    result = parser.parse({
      htmlRoot: container,
      js: ' get ByRol e(`button`);',
    });
    expect(result.expression.expression).toEqual('getByRole(`button`)');
  });
});
