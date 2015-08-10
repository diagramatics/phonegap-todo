'use strict';
/* global angular */

var app = angular.module('phonegapTodo', []);

app.controller('TodoController', function() {
  this.todos = [];

  this.addTodo = function() {
    if (this.addTodo.field.match(/^\w/i)) {
      this.todos.push({
        text: this.addTodo.field,
        deadline: '0'
      });
      this.addTodo.field = '';
    }
  };
});
