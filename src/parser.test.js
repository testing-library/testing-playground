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
  it('should give an error if the query is not valid', () => {
    const container = setup();
    const result = parser.parse(container, 'invalidquery');
    expect(result.error).toBeDefined();
    expect(result.errorBody).toBeDefined();
  });

  it('should return targets as array', () => {
    const container = setup();
    let result = parser.parse(container, "screen.getAllByRole('button')");
    expect(result.targets).toBeArray();
    expect(result.targets).toHaveLength(2);
    result = parser.parse(container, 'screen.getByText("I\'m a label")');
    expect(result.targets).toBeArray();
    expect(result.targets).toHaveLength(1);
  });

  it('should return getByPlaceholderText as expression', () => {
    const container = setup();
    let result = parser.parse(
      container,
      `screen.getAllByRole('button');
        screen.getByPlaceholderText("I'm a placeholder");`,
    );
    expect(result.expression).toMatchSnapshot();
  });
});
