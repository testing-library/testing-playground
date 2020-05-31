import state from './state';

describe('state', () => {
  describe('updateTitle', () => {
    it('should update title successfully', () => {
      document.title = 'playground';
      state.updateTitle('myTitle');
      expect(document.title).toEqual('playground: myTitle');
    });

    it('should set as title the string before colon if a new one is not passed to function', () => {
      document.title = 'playground: test';
      state.updateTitle();
      expect(document.title).toEqual('playground');
    });

    it('should set as title the string before colon if a non-string is passed to function', () => {
      document.title = 'playground: test';
      state.updateTitle({ test: 'test' });
      expect(document.title).toEqual('playground');

      document.title = 'playground: test';
      state.updateTitle(['test']);
      expect(document.title).toEqual('playground');

      document.title = 'playground: test';
      state.updateTitle(undefined);
      expect(document.title).toEqual('playground');

      document.title = 'playground: test';
      state.updateTitle(null);
      expect(document.title).toEqual('playground');
    });

    it('should remove useless spaces before update title', () => {
      document.title = 'playground';
      state.updateTitle(
        'this is       a the with                a lot of spaces ',
      );
      expect(document.title).toEqual(
        'playground: this is a the with a lot of spaces',
      );
    });
  });

  describe('save', () => {
    it('should save state successfully', () => {});

    it('should save state markup is not valid', () => {});
    it('should save state query is not valid', () => {});
    it('should preserve current search params after saving', () => {});
  });

  describe('load', () => {
    it('should read state successfully', () => {});
  });
});
