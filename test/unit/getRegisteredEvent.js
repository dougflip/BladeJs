test( "getRegisteredEvent returns 'click' for a button by default", function() {
  var evtData = $('#btnTest1').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('click', evtData[0], 'Entry in event data was not click');
});

test( "getRegisteredEvent returns two pieces of data when used as a delegate", function() {
  var evtData = $('.wrapper.ajax-on').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(2, evtData.length, "Event data did not contain 2 pieces of data");
  equal('click', evtData[0], 'The event in delegate signature should be click');
  equal('button', evtData[1], 'The selector in delegate signature should be button');
});

test( "getRegisteredEvent returns 'submit' for a form by default", function() {
  var evtData = $('#UserForm').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('submit', evtData[0], 'Entry in event data was not submit');
});

test( "getRegisteredEvent returns 'change' for a select by default", function() {
  var evtData = $('#Title').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('change', evtData[0], 'Entry in event data was not change');
});

test( "getRegisteredEvent returns 'change' for a text input by default", function() {
  var evtData = $('#FirstName').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('change', evtData[0], 'Entry in event data was not change');
});
