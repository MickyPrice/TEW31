// Initialize Firebase
var config = {
  apiKey: "AIzaSyDuJxq5bJwsqgPnehAiA1dzkit8l2FnX6g",
  authDomain: "tew31-1449c.firebaseapp.com",
  databaseURL: "https://tew31-1449c.firebaseio.com",
  projectId: "tew31-1449c",
  storageBucket: "",
  messagingSenderId: "489031115838"
};
firebase.initializeApp(config);


let signedIn
let currentUser = {}


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    signedIn = true;
    currentUser.uid = user.uid

    // Waits for some form of response from the database
    firebase.database().ref("/notes/" + user.uid).once('value', snap => {
      if (snap.exists() === true) {
        // if the response says that notes exist in the database
        findIdentifier('lessonNotes-loading').style.display = 'none'
      }
    })

    // When a note is deleted from the database
    firebase.database().ref("/notes/" + user.uid).on('child_added', snap => {
      // Remove it from the page.
      createCardElement(snap.key, snap.val().title, snap.val().content, snap.val().timestamp)
    })

    // When a note is deleted from the database
    firebase.database().ref(`/notes/${currentUser.uid}/`).on('child_removed', snap => {
      // Remove it from the page.
      document.getElementById(snap.key).remove()
    })

  } else {
    // No user is signed in.
    signedIn = false;
  }
});





function createCardElement(id, title, content, date) {
  var element = document.createElement('div')
  element.setAttribute('class', 'shadow-md rounded p-4 bg-green-lightest mb-4');
  element.setAttribute('id', id)
  var data = `<button class="text-red float-right" onclick="deleteNote('${id}')"><i class="fas fa-2x fa-times"></i></button><h1>${title}</h1><p>${content}</p>`
  element.innerHTML = data
  findIdentifier('lessonNotes').prepend(element)
}


function deleteNote(id) {
  if (currentUser && id && signedIn === true) {
    firebase.database().ref(`/notes/${currentUser.uid}/${id}`).remove()
  }else {
    console.error("Failed to run deleteNote - User is either not signed in or an ID was missing");
  }
}








function signIn(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Errors
    alert(error.message)
  });
}
