test("jQueryEval should use an ID selector to locate an element", function(){
  var $result = $('#jQueryEval .id-selector').blade('jQueryEval');
  ok($result != null, "NULL was returned from jQueryEval");
  equal($result.length, 1, 'jQueryEval implicit should select 1 button');
  equal($result.attr('id'), 'jQueryEvalTarget1', 'jQueryEval should have selected one element with ID jQueryEvalTarget1');
});

test("jQueryEval should use a class selector to locate elements", function(){
  var $result = $('#jQueryEval .class-selector').blade('jQueryEval');
  ok($result != null, "NULL was returned from jQueryEval");
  equal($result.length, 2, 'Class selection should have returned two elements');
  equal($result.filter('#jQueryEvalTarget1').length, 1, "Did not find jQueryEvalTarget1");
  equal($result.filter('#jQueryEvalTarget2').length, 1, "Did not find jQueryEvalTarget2");
});

test( "jQueryEval should use traverse to find elements relative to the selected element", function() {
  var $result = $('#jQueryEval .traverse').blade('jQueryEval');
  ok($result != null, "NULL was returned from jQueryEval");
  equal($result.length, 2, "Traverse should have returned two input elements");
  equal($result.filter('#jQueryEvalTarget1').length, 1, "Did not find jQueryEvalTarget1");
  equal($result.filter('#jQueryEvalTarget2').length, 1, "Did not find jQueryEvalTarget2");
});

test( "jQueryEval should use a function to locate elements", function() {
  var $result = $('#jQueryEval .func').blade('jQueryEval');
  ok($result != null, "NULL was returned from jQueryEval with func");
  equal($result.length, 1, "Func should have returned 1 element");
  equal($result.attr('id'), 'jQueryEvalTarget1', 'Func should have returned 1 element with ID jQueryEvalTarget1');
});

test( "jQueryEval returns an empty set with no matching selector", function() {
  var $result = $('#jQueryEval .no-match').blade('jQueryEval');
  ok($result != null, "NULL was returned from jQueryEval with func");
  equal($result.length, 0, "Invalid input should result in an empty input");
});

test( "jQueryEval returns an empty set when given null", function() {
  var $result = $('#jQueryEval .null-query').blade('jQueryEval',null);
  ok($result != null, "NULL was returned from jQueryEval with null input");
  equal($result.length, 0, "NULL input should result in an empty input");
});

test( "jQueryEval returns an empty set when given empty string", function() {
  var $result = $('#jQueryEval .empty-string').blade('jQueryEval');
  ok($result != null, "NULL was returned from jQueryEval with empty string input");
  equal($result.length, 0, "EMPTY STRING input should result in an empty input");
});

test("jQueryEval can be overridden by providing a string argument", function(){
  var $result = $('#jQueryEval .id-selector').blade('jQueryEval', '#jQueryEvalTarget2');
  ok($result != null, "NULL was returned from jQueryEval");
  equal($result.length, 1, 'jQueryEval override should have selected 1 element');
  equal($result.attr('id'), 'jQueryEvalTarget2', 'jQueryEval should have selected one element with ID jQueryEvalTarget2');
});

function testFunc($el){
  return $el.closest('.test-container').find('#jQueryEvalTarget1');
}
