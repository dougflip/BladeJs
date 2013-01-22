document.testResolve = function(){};

var ns = {
  testResolve: function(){}
};

test("resolveObject defaults to searching the document for an object", function(){
  var funcRef = $.fn.blade.utils.resolveObject('testResolve');
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(document.testResolve, funcRef);
});

test("resolveObject can explicitly search the document for an object", function(){
  var funcRef = $.fn.blade.utils.resolveObject('testResolve', document);
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(document.testResolve, funcRef);
});

test("resolveObject can find a namespaced object given a context", function(){
  var funcRef = $.fn.blade.utils.resolveObject('testResolve', ns);
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(ns.testResolve, funcRef);
  ok(funcRef !== document.testResolve);
});

test("resolveObject can find a namespaced object by a fully qualified string name", function(){
  var funcRef = $.fn.blade.utils.resolveObject('ns.testResolve');
  ok(funcRef != null, 'Function at the document level was not resolved');
  deepEqual(ns.testResolve, funcRef);
  ok(funcRef !== document.testResolve);
});
