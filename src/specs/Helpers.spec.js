import {prune, fileExists} from '../Helpers';

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
