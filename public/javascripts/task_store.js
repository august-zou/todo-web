var EventEmitter = require('events').EventEmitter;
var inherits = require('util').inherits;
var request = require('superagent');

function TaskStore() {
  this._host = "http://127.0.0.1:3001";
  this._tasks = [];

  var typeFromHash = location.hash.slice(1);
  this._type = ~['Completed', 'Active'].indexOf(typeFromHash)
    ? typeFromHash
    : 'All';

  this._changeTask();
  // auto refresh
  setInterval(this._changeTask.bind(this), 2000);
}

inherits(TaskStore, EventEmitter);

TaskStore.prototype.list = function () {
  return this._tasks;
};

TaskStore.prototype.create = function (title) {
  request
    .post(this._host+'/tasks')
    .send({title: title})
    .end(this._changeTask.bind(this));
};

TaskStore.prototype.update = function (task) {
  request
    .put(this._host+'/tasks/' + task.id)
    .send(task)
    .end(this._changeTask.bind(this));
};

TaskStore.prototype.destroy = function (task) {
  request
    .del(this._host+'/tasks/' + task.id)
    .end(this._changeTask.bind(this));
}

TaskStore.prototype.clearCompeted = function () {
  request
    .post(this._host+'/tasks/clear')
    .end(this._changeTask.bind(this));
};

TaskStore.prototype.completeAll = function () {
  request
    .post(this._host+'/tasks/complete')
    .end(this._changeTask.bind(this));
};

TaskStore.prototype.getType = function () {
  return this._type;
};

TaskStore.prototype.selectType = function (type) {
  this._type = type;
  this.emit('change');
};

TaskStore.prototype._changeTask = function () {
  request
  .get(this._host+'/tasks')
  .end(function (err, res) {
    if (err) {
      console.error(err);
      this.emit('error', err);
    }
    if (res.body) this._tasks = res.body;
    this.emit('change');
  }.bind(this));
};

var taskStore = new TaskStore();
module.exports = taskStore;
