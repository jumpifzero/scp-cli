"use strict";

var page = require('webpage').create();
// Set Chrome's user agent
page.settings.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36";


function waitFor(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 60000, //< Default Max Timout is 1m
      start = new Date().getTime(),
      condition = false,
      interval = setInterval(function() {
        if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
          // If not time-out yet and condition not yet fulfilled
          condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
        } else {
          if(!condition) {
            // If condition still not fulfilled (timeout but condition is 'false')
            console.log("'waitFor()' timeout");
            phantom.exit(1);
          } else {
            // Condition fulfilled (timeout and/or condition is 'true')
            console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
            typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
            clearInterval(interval); //< Stop this interval
          }
        }
      }, 1000);
};


var isLogonButtonVisible = function() {
  // Check in the page if a specific element is available
  return page.evaluate(function() {
    return (document.getElementById("__jsview0--logon") !== null);
  });
};



var isUsernameFieldVisible = function () {
  // Check in the page if a specific element is now visible
  return page.evaluate(function() {
    return (document.getElementById("j_username") !== null);
  });
};


page.onResourceReceived = function(response) {
  console.log(JSON.stringify(response.headers.find(function(x){return x.name==="Set-Cookie";})));
};
// page.onResourceReceived = function(response) {
//   var cookies = response.headers.find(x => x.name == "cookie");
//   if (cookies) {
//     console.log('Om Nom Nom');
//     console.log(cookies.value);
//   }
// };




    // // Register an event so we need when this is finished
    // page.onLoadFinished = function(){
    //   console.log('Logon procedure is finished');
    //   phantom.exit();
    // };

var thenTypeCredentials = function () {
  console.log("Will type credentials");
  page.render("trololol3.png");
  page.evaluate(function() {
    console.log("Inserting credentials");
    document.getElementById("j_username").value = "fixme";
    document.getElementById("j_password").value = "fixme";
    // Simulate a click, the proper way
    function triggerMouseEvent (node, eventType) {
      var clickEvent = document.createEvent("MouseEvents");
      clickEvent.initEvent (eventType, true, true);
      node.dispatchEvent(clickEvent);
    }
    var btn = document.getElementById("logOnFormSubmit");
    triggerMouseEvent(btn, "mousedown");
    triggerMouseEvent(btn, "mouseup");
    triggerMouseEvent(btn, "click");
  });
};



var thenClickLogonButton =  function () {
  console.log("The LogOn button should be visible now.");
  page.render("trololol2.png");
  page.evaluate(function() {
    sap.ui.getCore().byId("__jsview0--logon").firePress();
  });
  page.render("trololol2.5.png");
  waitFor(isUsernameFieldVisible, thenTypeCredentials);
};


// Open SCP cockpit
page.open("https://account.hana.ondemand.com/#/home/welcome", function (status) {
  // Wait for 'signin-dropdown' to be visible
  console.log("Waiting for the Logon button to appear");
  waitFor(isLogonButtonVisible, thenClickLogonButton);
});
