// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBA5R6y2wmAMk0PJD404qRnvIBKTHNBl78",
  authDomain: "todolist-e1449.firebaseapp.com",
  databaseURL: "https://todolist-e1449.firebaseio.com",
  projectId: "todolist-e1449",
  storageBucket: "",
  messagingSenderId: "269982524951",
  appId: "1:269982524951:web:a9097702dc7d1ab33d1e52"
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
  apiKey: "AIzaSyBA5R6y2wmAMk0PJD404qRnvIBKTHNBl78",
  authDomain: "todolist-e1449.firebaseapp.com",
  projectId: "todolist-e1449"
});

var db = firebase.firestore();

function getData(uid) {
  db.collection("tasks")
    .onSnapshot(function (QuerySnapshot) {
      // cleanTasks();
      QuerySnapshot.docChanges().forEach(e => {
        if (e.doc.data().userId == uid) {
          displayTasks(e.doc.data())
        }
        // $(".chat-body").prepend(messageTemplate(e.doc.data()));
      });
    });
}

var currentUser;

const onClickLogin = e => {
  e.preventDefault();

  var email = $("#email").val();
  var password = $("#password").val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      console.log("Error code: ", error.code);
      console.log("Error message:", error.message);
    });
}

firebase.auth().onAuthStateChanged(function (user) {
  // cleanTasks();
  currentUser = user;
  if (currentUser) {
    $(".card-body").show();
    $(".tasks-login").html("");
    $("#logout-btn").show();
    getData(currentUser.uid);
    console.log("User is authenticated!");
  } else {
    $(".tasks-login").show();
    $(".card-body").hide();
    $("#logout-btn").hide();
    console.log("User is not authenticated!");
  }
});

// Add a new document in collection "cities"
const addTask = (name, userId) => {
  db.collection("tasks").doc().set({
    name: name,
    userId: userId,
  })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}
////////////////////////////////


const displayTasks = ((tasks) => {
  console.log(tasks); // se puede borrar
  $(".tasks").append(`<li class="${tasks.userId}">${tasks.name}</li>`)
});

const cleanTasks = () => {
  $(".tasks").html("");
}

const logOut = () => {
  firebase.auth().signOut()
    .then(() => {
      console.log('Signed Out');
    }).catch(error => {
      console.error('Sign Out Error', error);
    });
}

const onInputKeypress = function (e) {
  if (e.which == 13) {
    addTask($(this).val(), currentUser.uid);
    $(this).val('')
  }
}

$("#login-btn").on("click", onClickLogin);
$("#logout-btn").on("click", logOut);
$("input").on('keypress', onInputKeypress);

/***************
 * rules
 */

/*match /users/{userId} {
       allow read, write, delete: if request.auth.uid == userId;
   }
   match /tasks/{userId} {
   allow read, write, delete: if request.auth.uid == userId;
   }*/


/***************
 * 
 */



const onDelete = function (e) {
  const id = parseInt($('.task').attr('id'));
  $(this).parent().remove();
  _delete(id)
  event.stopPropagation();
}

const onToggleDone = function (e) {
  const id = parseInt($('.task').attr('id'));
  $(e.currentTarget).toggleClass("completed");
  if ($(e.currentTarget).hasClass('completed')) {
    state({ 'id': id, 'done': true })
  } else {
    state({ 'id': id, 'done': false })
  }
  event.stopPropagation();
}

const onClickEdit = function (e) {
  const id = $(this).parent().attr('id')
  const text = $(this).parent().text();
  $(this).parent().replaceWith('<input type="text" id="' + id + '" class="form-control editText" placeholder="Add new task" value="' + text + '" aria-label="Username" aria-describedby="basic-addon1">')
  console.log('Esto es ID' + id);
  event.stopPropagation();
}

const onClickEditText = function (e) {
  if (e.which == 13) {
    const id = parseInt($(this).attr('id'));
    const text = $(this).val();
    console.log('se MANDA AQUI ');
    state({ 'id': id, 'title': text });
    $(this).replaceWith(`<li class=" d-flex justify-content-between card-text task" id="${id}"><span class='delete'><i class="fa fa-trash"></i></span>${text}<span class="edit"><i class="fa fa-pencil "></i></span></li>`)

  }
  e.stopPropagation();
}


$('ul').on('click', '.delete', 'i', onDelete);
$('ul').on('click', 'li', onToggleDone);
$('ul').on('click', '.edit', onClickEdit);
$("ul").on('keypress', '.editText', onClickEditText);

const state = (data) => {
  _put(data, data.id);
}

// _get()

