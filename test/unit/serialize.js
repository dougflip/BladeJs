test( 'The serialize method returns the form element on GET requests', function() {
  var value = $('#FirstName').blade('serialize');
  ok(value != null, 'Should have received a serialized value');
  deepEqual('FirstName=Geddy', value, 'FirstName should serialize to FirstName=Geddy');
});

test( 'The serialize method returns the closest form on POST requests', function() {
  var value = $('#LastName').blade('serialize');
  ok(value != null, 'Should have received a serialized value');
  deepEqual($('#UserForm').serialize(), value, 'Returned value should equal the serialized form');
});

test( 'The serialize method returns an object when one is specified in data-serialize', function() {
  var data = $('#CustomerInfo').blade('serialize');
  ok(data != null, 'Data should be a real object');
  deepEqual(1, data.CustomerId, 'CustomerId should be an integer value of 1');
  deepEqual(true, data.IsActive, 'IsActive');
});

test( 'The serialize method forwards to jQueryEval when given a string', function() {
  var data = $('#UserFormSubmitButton').blade('serialize');
  ok(data != null, 'Should receive a result from serialize');
  deepEqual($('#UserForm').find(':input').serialize(), data, 'CustomerId should be an integer value of 1');
});
