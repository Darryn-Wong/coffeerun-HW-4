
(function (window) {
    'use strict';

    var App = window.App || {};
    var $ = window.jQuery;
    const firebaseConfig = {
        apiKey: "AIzaSyBAiYUVRYXLlO0tmf-B66zM9BoG2ysBaRU",
        authDomain: "coffee-run-47d6b.firebaseapp.com",
        projectId: "coffee-run-47d6b",
        storageBucket: "coffee-run-47d6b.appspot.com",
        messagingSenderId: "899765375998",
        appId: "1:899765375998:web:31c94313efde7ffd3e26af"
    };
    class FireBaseDataStore {
        constructor() {
            console.log('running the FireBaseDataStore function');
            firebase.initializeApp(firebaseConfig);
            // firebase.initializeApp(App.FirebaseConfig.firebaseConfig);
            this.firestore = firebase.firestore();
        }

        async add(key, val) {
            console.log('firebase add  ')
            const docRef = this.firestore.doc(`orders/${this.makeDocHash(20)}`);
            return docRef.set(val); // i realize that could just use .add, but wanted to try .set instead.
            // return this.firestore.doc(`orders/${key}`).set(val);
        }
        async get(email, cb) {
            const docRef = this.firestore.collection(`orders`);
            const snapshot = await docRef.where('emailAddress', '==', email).get();
            return await snapshot.docs.map(e => e.data());
        }
        async getAll(cb) {
            const docRef = this.firestore.collection(`orders`);
            const snapshot = await docRef.get();
            return await snapshot.docs.map(e => e.data());
        }
        async remove(email) {
            const docRef = await this.firestore.collection(`orders`);
            const batch = this.firestore.batch();
            const snapshot = await docRef.where('emailAddress', '==', email).get();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();
        }
        makeDocHash(len) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < len; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }

        loadInitData() {
            // return await snapshot.docs.map(e => e.data());
            this.firestore.collection("orders").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let order = doc.data()
                    var $div = $('<div></div>', {
                        'data-coffee-order': 'checkbox', class: 'checkbox'
                    });

                    var $label = $('<label></label>');

                    var $checkbox = $('<input></input>', {
                        type: 'checkbox',
                        value: order.emailAddress
                    });

                    var desc = order.size + ' ';
                    if (order.flavor) {
                        desc += order.flavor + ' ';
                    }

                    desc += order.coffee + ', '
                        + ' (' + order.emailAddress + ')'
                        + ' [' + order.strength + 'x]';

                    $label.append($checkbox);
                    $label.append(desc);
                    $div.append($label);

                    this.$element = $div;
                    $(`[data-coffee-order="checklist"]`).append(this.$element);
                });
            });
        }
    }
    App.FireBaseDataStore = FireBaseDataStore;
    window.App = App;

})(window);