'use strict';
/* global angular */

var app = angular.module('phonegapTodo', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/partials/todo-initial.html',
      controller: 'TodoController as todo'
    })
    .when('/done', {
      templateUrl: '/partials/todo-done.html',
      controller: 'TodoDoneController as todoDone'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);

app.controller('TodoController', ['$scope', function($scope) {
  this.todos = [];

  this.lastTodoID = 1;
  var storedLastTodoID = window.localStorage.getItem('lastTodoID');
  if (storedLastTodoID && storedLastTodoID !== 'undefined') {
    this.lastTodoID = storedLastTodoID;
    storedLastTodoID = undefined;
  }

  var storedTodos = window.localStorage.getItem('todos');
  if (storedTodos && storedTodos !== 'undefined') {
    angular.copy(JSON.parse(storedTodos), this.todos);
    storedTodos = undefined;
  }

  $scope.$watch(function() {
    return this.todos;
  }.bind(this), function(newValue, oldValue) {
    window.localStorage.setItem('todos', JSON.stringify(newValue));
  }.bind(this), true);

  $scope.$watch(function() {
    return this.lastTodoID;
  }.bind(this), function(newValue) {
    window.localStorage.setItem('lastTodoID', newValue);
  });

  this.addTodo = function() {
    if (this.addTodo.field.match(/^\w/i)) {
      this.todos.push({
        id: this.lastTodoID++,
        text: this.addTodo.field,
        done: false
      });

      // Reset the field
      this.addTodo.field = '';
    }
  };

  this.markTodoAsDone = function(todoItem) {
    todoItem.done = true;
  };
}]);

app.controller('TodoDoneController', ['$scope', function($scope) {
  this.todos = [];

  var storedTodos = window.localStorage.getItem('todos');
  if (storedTodos && storedTodos !== 'undefined') {
    angular.copy(JSON.parse(storedTodos), this.todos);
    storedTodos = undefined;
  }
}]);
