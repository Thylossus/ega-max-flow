const stack = require('../structure/stack');
const repeat = require('lodash/string/repeat');

const EOL = require('os').EOL;
const LEVEL_LOG = 3;
const LEVEL_WARN = 2;
const LEVEL_ERROR = 1;

(function() {
  'use strict';

  class Logger {
    constructor(options) {
      this.print = options.print || false;
      this.groups = stack.create();

      this.rootGroup = new LogGroup();
      this.groups.push(this.rootGroup);
    }

    log(value, level) {
      level = level === undefined ? LEVEL_LOG : level;
      let entry = new LogEntry(value, level);
      let currentGroup = this.groups.top();
      currentGroup.addEntry(entry);

      if (this.print && level === LEVEL_LOG) {
        console.log(value);
      }

      return entry;
    }

    warn(value) {
      if (this.print) {
        console.warn(value);
      }

      return this.log(value, LEVEL_WARN);
    }

    error(value) {
      if (this.print) {
        console.error(value);
      }

      return this.log(value, LEVEL_ERROR);
    }

    group(name) {
      if (this.print) {
        console.group(name);
      }

      let group = new LogGroup(name);
      let currentGroup = this.groups.top();

      currentGroup.addEntry(group);

      this.groups.push(group);

      return group;
    }

    groupEnd() {
      if (this.print) {
        console.groupEnd();
      }

      if (this.groups.length !== 1) {
        return this.groups.pop();
      }
    }

    toString() {
      return this.rootGroup.toString(0);
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

    toString(depth) {
      depth = depth === undefined ? 0 : depth;
      let tabs = repeat('\t', depth);


      let output = this.entries.map((entry) => {
        return [tabs, entry.toString(depth + 1)].join('');
      });

      if (this.name !== undefined) {
        output = [`${this.name}:`].concat(output);
      }


      return output.join(EOL);
    }
  }

  class LogEntry {
    constructor(value, level) {
      this.value = value;
      this.level = level;
    }

    toString() {
      // TODO: include level?
      return this.value;
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
