// function checkSetup() {
//     if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
//         window.alert('You have not configured and imported the Firebase SDK. ' +
//             'Make sure you go through the codelab setup instructions and make ' +
//             'sure you are running the codelab using `firebase serve`');
//     }
// }
// // Checks that Firebase has been imported.
// checkSetup();

var firebaseConfig = {
    apiKey: "AIzaSyBAiYUVRYXLlO0tmf-B66zM9BoG2ysBaRU",
    authDomain: "coffee-run-47d6b.firebaseapp.com",
    projectId: "coffee-run-47d6b",
    storageBucket: "coffee-run-47d6b.appspot.com",
    messagingSenderId: "899765375998",
    appId: "1:899765375998:web:31c94313efde7ffd3e26af"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var signInButtonElement = document.getElementById('sign-in');
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

signInButtonElement.addEventListener('click', signIn);
signOutButtonElement.addEventListener('click', signOut);

function signIn() {
    // Sign into Firebase using popup auth & Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
    loadOrder();
}
function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}
function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.
        var profilePicUrl = getProfilePicUrl();
        var userName = getUserName();

        // Set the user's profile pic and name.
        // userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
        userNameElement.textContent = userName;

        // Show user's profile and sign-out button.
        userNameElement.removeAttribute('hidden');
        userPicElement.removeAttribute('hidden');
        signOutButtonElement.removeAttribute('hidden');

        // Hide sign-in button.
        signInButtonElement.setAttribute('hidden', 'true');
    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        userNameElement.setAttribute('hidden', 'true');
        userPicElement.setAttribute('hidden', 'true');
        signOutButtonElement.setAttribute('hidden', 'true');

        // Show sign-in button.
        signInButtonElement.removeAttribute('hidden');
    }
}
function saveMessage(messageText) {
    // Add a new message entry to the database.
    return firebase.firestore().collection('messages').add({
        name: getUserName(),
        text: messageText,
        profilePicUrl: getProfilePicUrl(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (error) {
        console.error('Error writing new message to database', error);
    });
}
// Loads chat messages history and listens for upcoming ones.

function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}
initFirebaseAuth();
function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}

// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function saveOrder(data) {
    return firebase.firestore().collection('order').add({
        name: getUserName(),
        coffee: data.coffee,
        emailAddress: data.emailAddress,
        size: data.size,
        flavor: data.flavor,
        strength: data.strength,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (error) {
        console.error('Error writing new message to database', error);
    });
}

function Row(coffeeOrder) {
    console.log(coffeeOrder.coffee, coffeeOrder.emailAddress, coffeeOrder.strength)
    var $div = $('<div></div>', {
        'data-coffee-order': 'checkbox',
        'class': 'checkbox'
    });
    var $label = $('<label></label>');
    var $checkbox = $('<input></input>', {
        type: 'checkbox',
        value: coffeeOrder.emailAddress
    });
    var description = coffeeOrder.size + ' ';
    if (coffeeOrder.flavor) {
        description += coffeeOrder.flavor + ' ';
    }
    description += coffeeOrder.coffee + ', ';
    description += ' (' + coffeeOrder.emailAddress + ')';
    description += ' [' + coffeeOrder.strength + 'x]';
    $label.append($checkbox);
    $label.append(description);
    $div.append($label);
    this.$element = $div;

}
function ChecklistAppend(order) {
    var rowElement = new Row(order);
    var CHECKLIST_SELECTOR = '[data-coffee-order="checklist"]';
    $element = $(CHECKLIST_SELECTOR);
    $element.append(rowElement.$element);
}

function loadOrder() {
    // Create the query to load the last 12 messages and listen for new ones.
    var query = firebase.firestore()
        .collection('order')
        .orderBy('timestamp', 'desc')
    // Start listening to the query.
    query.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === 'removed') {
                deleteMessage(change.doc.id);
            } else {
                var order = change.doc.data();
                ChecklistAppend(order);
                // displayorder(change.doc.id, order.timestamp, order.name,
                //     order.text, order.profilePicUrl, order.imageUrl);
            }
        });
    });
}