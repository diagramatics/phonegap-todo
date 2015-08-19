'use strict';
/* global angular */

var app = angular.module('phonegapTodo', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'partials/todo-initial.html',
      page: 'initial',
      controller: 'TodoController as todo'
    })
    .when('/done', {
      templateUrl: 'partials/todo-done.html',
      page: 'done',
      controller: 'TodoDoneController as todoDone'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.factory('todo', [function() {
  this.todos = {};

  // Get todo ID
  this.lastTodoID = 1;
  var storedLastTodoID = window.localStorage.getItem('lastTodoID');
  if (storedLastTodoID && storedLastTodoID !== 'undefined') {
    this.lastTodoID = storedLastTodoID;
    storedLastTodoID = undefined;
  }

  // Get todo list
  var storedTodos = window.localStorage.getItem('todos');
  if (storedTodos && storedTodos !== 'undefined') {
    angular.copy(JSON.parse(storedTodos), this.todos);
    storedTodos = undefined;
  }

  this.notifyTodoChange = function() {
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
  }.bind(this);

  // Increment todo ID method
  this.incrementTodoID = function() {
    window.localStorage.setItem('lastTodoID', ++this.lastTodoID);
    return this.lastTodoID - 1;
  }.bind(this);

  this.getAll = function() {
    return this.todos;
  }.bind(this);

  this.getUndone = function() {
    var result = {};
    angular.forEach(this.todos, function(value, key) {
      if (!value.done) {
        result[key] = value;
      }
    });
    return result;
  }.bind(this);

  this.getDone = function() {
    var result = {};
    angular.forEach(this.todos, function(value, key) {
      if (value.done) {
        result[key] = value;
      }
    });
    return result;
  }.bind(this);

  // Add todo method
  this.add = function(todoText) {
    var id = this.incrementTodoID();
    this.todos[id + ''] = {
      id: id,
      text: todoText,
      done: false
    };
    this.notifyTodoChange();
    return true;
  }.bind(this);

  this.markDone = function(todoID) {
    this.todos[todoID].done = true;
    this.notifyTodoChange();
    return this.todos;
  }.bind(this);

  this.markUndone = function(todoID) {
    this.todos.todoID.done = false;
    this.notifyTodoChange();
    return this.todos.todoID;
  }.bind(this);

  return this;
}]);

app.controller('MainController', ['$rootScope', '$location', function($rootScope, $location) {
  this.path = $location.path();


  $rootScope.$on('$locationChangeSuccess', function() {
    this.path = $location.path();
  }.bind(this));

  this.openDrawer = function() {
    document.getElementById('mainDrawer').classList.add('is-visible');
    console.log('asd');
  }.bind(this);

  this.closeDrawer = function() {
    document.getElementById('mainDrawer').classList.remove('is-visible');
  }.bind(this);
}]);

app.controller('TodoController', ['$scope', 'todo', function($scope, todo) {
  this.addTodoView = {};
  this.todos = todo.getUndone;

  this.addTodo = function() {
    if (this.addTodoView.field.match(/^\w/i)) {
      todo.add(this.addTodoView.field);

      // Reset the field
      this.addTodoView.field = '';
    }
  };

  this.markTodoAsDone = function(todoID) {
    todo.markDone(todoID);
  };
}]);

app.controller('TodoDoneController', ['$scope', 'todo', function($scope, todo) {
  this.todos = todo.getDone;

  this.markTodoAsUndone = function(todoID) {
    todo.markUndone(todoID);
  };


}]);
