accountModule.directive('csAnimate', function () {
  return {
    restrict: 'A',
    replace: false,
    link: function (scope, element, attrs) {
      var actions = ['swing', 'pulse', 'flip', 'tada', 'bounce', 'bounceIn'];
      var animate = actions[Math.floor(actions.length * Math.random(0, 1))];
      $(element).addClass('animated').addClass(animate);
    }
  };
});