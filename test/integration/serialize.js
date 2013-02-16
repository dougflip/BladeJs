test( 'The serialize method returns the current element when there is no data attribute', function() {
  var value = $('#serialize .no-data-attribute').blade('serialize');
  ok(value !== null, 'Should have received a serialized value');
  deepEqual(value, 'FirstName=Geddy', 'FirstName should serialize to FirstName=Geddy');
});

test( 'The serialize method returns the current element when there is an empty data attribute', function() {
  var value = $('#serialize .empty-data-attribute').blade('serialize');
  ok(value !== null, 'Should have received a serialized value');
  deepEqual('MiddleName=Lee', value, 'MiddleName should serialize to MiddleName=Geddy');
});

test( 'The serialize method returns an object when one is specified in the data attribute', function() {
  var data = $('#serialize .data-attribute-object').blade('serialize');
  ok(data !== null, 'Data should be a real object');
  deepEqual(data.name, "Rush", 'Data object should have contained a name property');
  deepEqual(data.rank, 1, 'Data object should have contained a rank property');
});

test( 'The serialize method forwards string calls to jQueryEval', function() {
  var value = $('#serialize .forward-to-jquery-eval').blade('serialize');
  ok(value !== null, 'Should have received a serialized value');
  deepEqual(value, 'FirstName=Geddy', 'FirstName should serialize to FirstName=Geddy');
});
