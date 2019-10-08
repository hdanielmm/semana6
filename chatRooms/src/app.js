const messageTemplate = Handlebars.compile($("#message-template").html());
const roomTemplate = Handlebars.compile($("#room-template").html());

var currentUser;

// Your web app's Firebase configuration
var firebaseConfig = {
  // apiKey: "AIzaSyB6re0NezbhE-wiCV01d2RuFp7XHbuY5SI",
  // authDomain: "roomschatv3.firebaseapp.com",
  // databaseURL: "https://roomschatv3.firebaseio.com",
  // projectId: "roomschatv3",
  // storageBucket: "roomschatv3.appspot.com",
  // messagingSenderId: "719840639270",
  // appId: "1:719840639270:web:4e45e6ec29e32ff1a7e9e7"
  apiKey: "AIzaSyC2BRA6Dl7LWD0XyGmdcfEZh64yFGJjU4o",
  authDomain: "chatrooms-e126b.firebaseapp.com",
  databaseURL: "https://chatrooms-e126b.firebaseio.com",
  projectId: "chatrooms-e126b",
  storageBucket: "chatrooms-e126b.appspot.com",
  messagingSenderId: "548110208888",
  appId: "1:548110208888:web:9fe2572f249d78e50a428d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();

function addDatabase(collection, obj) {
  db.collection(collection).add(obj)
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

function showRoomMessages(e) {
  $(".chat-body").html("");
  $(".select-chat").remove();
  $(".active").removeClass("active")
  $(e.currentTarget).addClass("active");
  let id = $(e.currentTarget).attr("id");
  const room = db.collection("rooms").doc(id);
  console.log(room)

  db.collection("messages").where("room", '==', room).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        $(".chat-body").prepend(messageTemplate(doc.data()));
      })
    })
}

$(document).ready(function () {
  console.log($("#login-modal"))
  $("#login-modal").delay(1000).modal("show");
})

$("#btn-send").on("click", e => {
  let id = $(".active").attr("id");

  const message = $("#comment-input").val();
  const obj = {
    sender: "Esteban",
    message: message,
    room: db.doc("rooms/" + id)
  }

  addDatabase("messages", obj);
  $("#comment-input").val("");
});

$("#room-button").on("click", () => {
  const room = $("#room-input").val();
  const obj = {
    name: room
  }
  addDatabase("rooms", obj);
});

$("ul").on("click", ".room", showRoomMessages)

db.collection("messages")
  .onSnapshot(function (QuerySnapshot) {
    QuerySnapshot.docChanges().forEach(e => {
      $(".chat-body").prepend(messageTemplate(e.doc.data()));
    })
  });

db.collection("rooms")
  .onSnapshot(function (QuerySnapshot) {
    QuerySnapshot.docChanges().forEach(e => {
      let data = e.doc.data();
      data.id = e.doc.id;

      $(".list-group").append(roomTemplate(data));
    })
  });

/*******
 * Login
 */

$("#login-btn").on("click", function (e) {
  e.preventDefault();

  var email = $("#email").val();
  var password = $("#password").val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function (error) {
      console.log("Error code: ", error.code);
      console.log("Error message:", error.message);
    });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var currentUser = user;
    console.log(user);
    $("#login-modal").delay(1000).modal("hide");
    // mostrar la pantalla de mensajes y traer los rooms
  } else {
    console.log("User is not authenticated!");
  }
});
