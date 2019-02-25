// The findIdentifier is used in the app to find unique identifiers
// (Basically my own version of the getElementById function for this app)
function findIdentifier(name) {
  var elements = document.querySelectorAll(`[app-identifier="${name}"]`)
  if (elements[0]) {return elements[0]}
}





/*
Find what lesson a client is looking for,
if the lesson's manifest & content is found, display it,
else, give them a 404 page.
*/


function loadLesson(lessonID) {
  getJsonFile(`/app/lessons/${lessonID}/manifest.json`, data => {
    // do something with your data
    if (data !== "404") {
      findIdentifier("title").innerText = data.title
    }else {
      location.href = "/app"
    }
  });
}


function getJsonFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var data = JSON.parse(httpRequest.responseText);
      if (callback) callback(data);
    }
    if (httpRequest.readyState === 4 && httpRequest.status === 404) {
      if (callback) callback("404")
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}
