const stack = require('../structure/stack');

const LEVEL_LOG = 3;
const LEVEL_WARN = 2;
const LEVEL_ERROR = 1;

(function() {
  'use strict';

  class Logger {
    constructor(options) {
      this.print = options.print || false;
      this.groups = stack.create();

      let rootGroup = new LogGroup();
      this.groups.push(rootGroup);
    }

    log(value, level) {
      level = level === undefined ? LEVEL_LOG : level;
      let entry = new LogEntry(value, level);
      let currentGroup = this.groups.top();
      currentGroup.addEntry(entry);

      return entry;
    }

    warn(value) {
      return this.log(value, LEVEL_WARN);
    }

    error(value) {
      return this.log(value, LEVEL_ERROR);
    }

    group(name) {
      let group = new LogGroup(name);
      let currentGroup = this.groups.top();

      currentGroup.addEntry(group);

      this.groups.push(group);

      return group;
    }

    groupEnd() {
      if (this.groups.length !== 1) {
        return this.groups.pop();
      }
    }
  }

  class LogGroup {
    constructor(name) {
      this.name = name;
      this.entries = [];
    }

    addEntry(logEntry) {
      this.entries.push(logEntry);
    }
  }

  class LogEntry {
    constructor(value, level) {
      this.value = value;
      this.level = level;
    }
  }

  exports.create = (options) => {
    options = options || {};

    return new Logger(options);
  };

  exports.Logger = Logger;
  exports.LogGroup = LogGroup;
  exports.LogEntry = LogEntry;

}());
