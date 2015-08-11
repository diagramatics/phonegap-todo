/* global angular */
'use strict';

var app = angular.module('phonegapTodo', []);

app.controller('TodoController', ['$scope', function($scope) {
  // this.todos = window.localStorage.getItem('todos') || [];
  this.todos = [];
  var storedTodos = window.localStorage.getItem('todos');
  if (storedTodos && storedTodos !== 'undefined') {
    angular.copy(JSON.parse(storedTodos), this.todos);
    storedTodos = undefined;
  }

  $scope.$watch(function() {
    return this.todos;
  }.bind(this), function(newValue, oldValue) {
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
  }.bind(this), true);

  this.addTodo = function() {
    if (this.addTodo.field.match(/^\w/i)) {
      this.todos.push({
        text: this.addTodo.field,
        deadline: '0'
      });

      // Reset the field
      this.addTodo.field = '';
    }
  };
}]);
