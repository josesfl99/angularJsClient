'use strict';

// Register `news` component, along with its associated controller and template
angular.
  module('news').
  component('news', {
    templateUrl: 'news/news.template.html',
    controller: [
      function NewsController() {

      }
    ]
  });