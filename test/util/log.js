'use strict';

const chai = require('chai');
const expect = chai.expect;

const log = require('../../src/js/util/log');

describe('Log', () => {

  describe('module methods', () => {

    describe('#create', () => {

      it('should create a logger object', () => {
        let logger = log.create();

        expect(logger).to.be.an('object');
        expect(logger).to.be.instanceof(log.Logger);
      });

      it('should create a logger with default options', () => {
        let logger = log.create();

        expect(logger.print).to.be.false;
      });

      it('should take an options object', () => {
        let options = {
          print: false
        };
        let logger = log.create(options);

        expect(logger.print).to.be.equal(options.print);
      });

    });

  });

  describe('class methods', () => {

    describe('#log', () => {

      it('should return a log entry object', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.log(value);

        expect(logEntry).to.be.instanceof(log.LogEntry);
      });

      it('should return a log entry object of level 3', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.log(value);

        expect(logEntry.level).to.be.equal(3);
      });

      it('should return a log entry with the correct value', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.log(value);

        expect(logEntry.value).to.be.equal(value);
      });

      it('should append the entry to the end of the top group\'s entry list', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.log(value);
        let lastEntry = logger.groups.top().entries[logger.groups.top().entries.length - 1];

        expect(lastEntry).to.be.equal(logEntry);
      });

    });

    describe('#group', () => {

      it('should return a log group', () => {
        let logger = log.create();

        let group = logger.group();

        expect(group).to.be.instanceof(log.LogGroup);
      });

      it('should set a group\'s name', () => {
        let logger = log.create();

        let name = 'test';
        let group = logger.group(name);

        expect(group.name).to.be.equal(name);
      });

      it('should add an entry to the current group\'s entry list', () => {
        let logger = log.create();
        let currentGroup = logger.groups.top();

        let group = logger.group();

        expect(currentGroup.entries[currentGroup.entries.length - 1]).to.be.equal(group);
      });

      it('should add the group to the groups stack', () => {
        let logger = log.create();

        let group = logger.group();

        expect(logger.groups.top()).to.be.equal(group);
      });

    });

    describe('#groupEnd', () => {

      it('should remove the top group of the group stack', () => {
        let logger = log.create();
        logger.group();
        logger.group();
        let size = logger.groups.length;

        logger.groupEnd();

        expect(logger.groups.length).to.be.equal(size - 1);
      });

      it('should not remove the root group', () => {
        let logger = log.create();
        let size = logger.groups.length;

        logger.groupEnd();

        expect(logger.groups.length).to.be.equal(size);
      });

    });

    describe('#warn', () => {
      it('should return a log entry object', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.warn(value);

        expect(logEntry).to.be.instanceof(log.LogEntry);
      });

      it('should return a log entry object of level 2', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.warn(value);

        expect(logEntry.level).to.be.equal(2);
      });

      it('should return a log entry with the correct value', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.warn(value);

        expect(logEntry.value).to.be.equal(value);
      });

      it('should append the entry to the end of the top group\'s entry list', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.warn(value);
        let lastEntry = logger.groups.top().entries[logger.groups.top().entries.length - 1];

        expect(lastEntry).to.be.equal(logEntry);
      });
    });

    describe('#error', () => {
      it('should return a log entry object', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.error(value);

        expect(logEntry).to.be.instanceof(log.LogEntry);
      });

      it('should return a log entry object of level 1', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.error(value);

        expect(logEntry.level).to.be.equal(1);
      });

      it('should return a log entry with the correct value', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.error(value);

        expect(logEntry.value).to.be.equal(value);
      });

      it('should append the entry to the end of the top group\'s entry list', () => {
        let logger = log.create();
        let value = 'test';

        let logEntry = logger.error(value);
        let lastEntry = logger.groups.top().entries[logger.groups.top().entries.length - 1];

        expect(lastEntry).to.be.equal(logEntry);
      });
    });

  });

});
