test( "getRegisteredEvent returns 'click' for a button by default", function() {
  var evtData = $('#getRegisteredEvent .default-for-button').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('click', evtData[0], 'Entry in event data was not click');
});

test( "getRegisteredEvent returns 'submit' for a form by default", function() {
  var evtData = $('#getRegisteredEvent .default-for-form').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('submit', evtData[0], 'Entry in event data was not submit');
});

test( "getRegisteredEvent returns 'change' for a select by default", function() {
  var evtData = $('#getRegisteredEvent .default-for-select').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('change', evtData[0], 'Entry in event data was not change');
});

test( "getRegisteredEvent returns 'change' for a text input by default", function() {
  var evtData = $('#getRegisteredEvent .default-for-text').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain exactly 1 entry");
  equal('change', evtData[0], 'Entry in event data was not change');
});

test( "getRegisteredEvent is overridden by an on data attribute", function() {
  var evtData = $('#getRegisteredEvent .override-default-with-on').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(1, evtData.length, "Event data did not contain 1 piece of data");
  equal('hover', evtData[0], 'The event in delegate signature should be hover');
});

test( "getRegisteredEvent returns two pieces of data when used as a delegate", function() {
  var evtData = $('#getRegisteredEvent .as-delegate').blade('getRegisteredEvent');
  ok(evtData != null, "Returned event data was NULL");
  equal(2, evtData.length, "Event data did not contain 2 pieces of data");
  equal('click', evtData[0], 'The event in delegate signature should be click');
  equal('button', evtData[1], 'The selector in delegate signature should be button');
});
