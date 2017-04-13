import gutil from 'gulp-util';
import {prune, fileExists, log} from '../Helpers';
import {PLUGIN_NAME} from '../GulpSassPedigree';

describe('Helpers.prune', () => {

  it('should return a non-duped array values', () => {
    let list = ['test', 'testb', 'test', 'testc', 'testb'];

    expect(prune(list)).toEqual(['test', 'testc', 'testb']);
  })
});

describe('Helpers.fileExists', () => {

  it('should return a boolean', () => {

    expect(fileExists('something')).toEqual(jasmine.any(Boolean));
  })
});


describe('Helpers.log', () => {

  beforeAll(() => {
    spyOn(gutil, 'log');
  });

  it('should call gutil.log', () => {
    let type = 'foo';
    let msg = gutil.colors.cyan(`${PLUGIN_NAME}::${type}`);
    log(type);

    expect(gutil.log).toHaveBeenCalled();
    expect(gutil.log).toHaveBeenCalledWith(msg);

    log(type, 'baz');
    expect(gutil.log).toHaveBeenCalledWith(msg, 'baz');
  });

  describe('should switch through message type', () => {
    it('default = info = cyan', () => {
      let type = 'foo';
      let msg = gutil.colors.cyan(`${PLUGIN_NAME}::${type}`);
      log(type);

      expect(gutil.log).toHaveBeenCalled();
      expect(gutil.log).toHaveBeenCalledWith(msg);
    });

    it('info = info = cyan', () => {
      let type = 'info';
      let msg = gutil.colors.cyan(`${PLUGIN_NAME}::${type}`);
      log(type);

      expect(gutil.log).toHaveBeenCalled();
      expect(gutil.log).toHaveBeenCalledWith(msg);
    });

    it('warn = warn = yellow', () => {
      let type = 'warn';
      let msg = gutil.colors.yellow(`${PLUGIN_NAME}::${type}`);
      log(type);

      expect(gutil.log).toHaveBeenCalled();
      expect(gutil.log).toHaveBeenCalledWith(msg);
    });

    it('error = error = red', () => {
      let type = 'error';
      let msg = gutil.colors.red(`${PLUGIN_NAME}::${type}`);
      log(type);

      expect(gutil.log).toHaveBeenCalled();
      expect(gutil.log).toHaveBeenCalledWith(msg);
    });
  });
});
