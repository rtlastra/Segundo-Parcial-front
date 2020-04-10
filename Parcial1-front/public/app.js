
function register() {

    var email = document.getElementById('emailr').value;
    var password = document.getElementById('passwordr').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (val) {
            var db = firebase.firestore();
            var user = firebase.auth().currentUser;
            db.collection("Company").add({
                name: "Rafael",
                email: user.email,
                uid: user.uid,
                type: 0
            })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });

        }, function (reason) {
            alert('No se pudo realizar el Registro');
        });
}
function registerOp() {
    var email = document.getElementById('2').value;
    var password = document.getElementById('3').value;
    var name = document.getElementById('1').value;
    var address = document.getElementById('4').value;

    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    db.collection("Operator").add({
        address:address,
        email: email,
        name: name,
        password:password,
        type: 1,
        uid: user.uid
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });


}
function login() {
    var email2 = document.getElementById('emaill').value;
    var password2 = document.getElementById('passwordl').value;
    firebase.auth().signInWithEmailAndPassword(email2, password2)
        .then(function (val) {
            alert("Autenticacion correcta");
            window.location.href = ('Operadores.html');

        }, function (reason) {
            var db = firebase.firestore();
            db.collection("Operator").where("email", "==", email2).where("password", "==", password2)
            .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.data().name);

                    if(doc.data().name){
                        window.location.href = ('Cuestionario.html');
                    }else{
                        alert("Fallo en la autenticacion");
                    }
                });
            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

           
        });
}
function obs() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log(user.email)
        } else {
            console.log("usuario nulo");
            location.replace("index.html");
        }

    });
}
function signout() {
    firebase.auth().signOut().then(function () {
        console.log('salio exitosamente');
    }).catch(function (error) {
        console.log('error al salir');
    });
}

function listar() {
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    var lista=document.getElementById('lista');
    lista.innerHTML='';
    db.collection("Operator").where("uid", "==", user.uid)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.data().name);
                lista.innerHTML+= `<option>${doc.data().name}</option>`
            });
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}
