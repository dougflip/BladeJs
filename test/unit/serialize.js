test( 'The serialize method returns the current element when there is no data attribute', function() {
  var value = $('#FirstName').blade('serialize');
  ok(value != null, 'Should have received a serialized value');
  deepEqual('FirstName=Geddy', value, 'FirstName should serialize to FirstName=Geddy');
});

test( 'The serialize method returns the current element when there is an empty data attribute', function() {
  var value = $('#MiddleName').blade('serialize');
  ok(value != null, 'Should have received a serialized value');
  deepEqual('MiddleName=Lee', value, 'MiddleName should serialize to MiddleName=Geddy');
  deepEqual('MiddleName=Lee', value, 'MiddleName should serialize to MiddleName=Geddy');
});

test( 'The serialize method returns an object when one is specified in data-serialize', function() {
  var data = $('#CustomerInfo').blade('serialize');
  ok(data != null, 'Data should be a real object');
  deepEqual(1, data.CustomerId, 'CustomerId should be an integer value of 1');
  deepEqual(true, data.IsActive, 'IsActive');
});

test( 'The serialize method finds an absolute selector when specified', function() {
  var data = $('#LastName').blade('serialize');
  ok(data != null, 'Should receive a result from serialize');
  deepEqual($('#FirstName, #MiddleName').serialize(), data, 'Should have serialized FirstName and MiddleName');
});

test( 'The serialize method finds a relative selector when specified', function() {
  var data = $('#UserFormSubmitButton').blade('serialize');
  ok(data != null, 'Should receive a result from serialize');
  deepEqual($('#UserForm').find(':input').serialize(), data, 'CustomerId should be an integer value of 1');
});
