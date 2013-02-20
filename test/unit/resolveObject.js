resolveObject = {
  testResolve: function(){},
  nestedNs: {
    testResolve: function(){}
  }
};

test("resolveObject will resolve against a context object", function(){
  var funcRef = $.fn.blade.utils.resolveObject('testResolve', resolveObject);
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(resolveObject.testResolve, funcRef);
});

test("resolveObject will resolve against a fully qualified string", function(){
  var funcRef = $.fn.blade.utils.resolveObject('resolveObject.testResolve');
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(resolveObject.testResolve, funcRef);
});

test("resolveObject can find a nested namespaced object given a context", function(){
  var funcRef = $.fn.blade.utils.resolveObject('testResolve', resolveObject.nestedNs);
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(resolveObject.nestedNs.testResolve, funcRef);
  ok(funcRef !== resolveObject.testResolve);
});

test("resolveObject can find a nested namespaced object by a fully qualified string name", function(){
  var funcRef = $.fn.blade.utils.resolveObject('resolveObject.nestedNs.testResolve');
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(resolveObject.nestedNs.testResolve, funcRef);
  ok(funcRef !== resolveObject.testResolve);
});
