test("jQueryEval -- selector only", function(){
  var $button = $('body').blade('jQueryEval', '#btnTest1');
  ok($button != null, "NULL was returned from jQueryEval");
  equal(1, $button.length, 'jQueryEval implicit should select 1 button');
  equal('btnTest1', $button.attr('id'), 'jQueryEval should have selected btnTest1');
});

test( "jQueryEval traverse -- traverse: closest('.wrapper').find(':input')", function() {
  var $button = $('#btnTest1').blade('jQueryEval',"traverse: closest('.wrapper').find('button')");
  ok($button != null, "NULL was returned from jQueryEval");
  equal($button.length, 1, "Should have traversed to ");
  equal('btnTest1', $button.attr('id'), 'jQueryEval should have selected btnTest1');
});

test( "jQueryEval func -- func: testFunc", function() {
  var $div = $('#btnTest1').blade('jQueryEval',"func: testFunc");
  ok($div != null, "NULL was returned from jQueryEval");
  equal($div.length, 1, "Func should have returned 1 element");
  ok($div.hasClass('wrapper'), 'Func should have found .wrapper DIV');
});

test( "jQueryEval returns an empty set with no matching selector", function() {
  var $div = $('#btnTest1').blade('jQueryEval',"#noMatch");
  equal($div.length, 0, "Invalid input should result in an empty input");
});

test( "jQueryEval returns an empty set when given null", function() {
  var $div = $('#btnTest1').blade('jQueryEval',null);
  equal($div.length, 0, "NULL input should result in an empty input");
});

test( "jQueryEval returns an empty set when given undefined", function() {
  var $div = $('#btnTest1').blade('jQueryEval',undefined);
  equal($div.length, 0, "UNDEFINED input should result in an empty input");
});

test( "jQueryEval returns an empty set when given empty string", function() {
  var $div = $('#btnTest1').blade('jQueryEval','');
  equal($div.length, 0, "EMPTY STRING input should result in an empty input");
});

function testFunc($el){
  return $el.closest('.wrapper');
}
