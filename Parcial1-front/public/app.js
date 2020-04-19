
function register() {
    var representante = document.getElementById('Representanter').value;
    var tipo = document.getElementById('TipoDr').value;
    var documento = document.getElementById('Documentor').value;
    var email = document.getElementById('emailr').value;
    var empresa = document.getElementById('Nombrer').value;
    var telefono = document.getElementById('telefonor').value;
    var password = document.getElementById('passwordr').value;
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(function (val) {
            var db = firebase.firestore();
            var user = firebase.auth().currentUser;
            db.collection("Company").add({
                representante: representante,
                tipo: tipo,
                documento: documento,
                email: user.email,
                nombre: empresa,
                telefono: telefono,
                uid: user.uid,
                Password: password
            })
                .then(function (docRef) {
                    console.log("Document written with ID: ", docRef.id);
                    signout();
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario registrado, ya puede ingresar',
                    });
                })
                .catch(function (error) {
                    console.error("Error adding document: ", error);
                });

        }, function (reason) {
            Swal.fire({
                icon: 'error',
                title: 'Usuario ya registrado o no se puede registrar',
            });
        });
}


function registerOp() {
    event.preventDefault();
   // listar();
    var email = document.getElementById('2').value;
    var password = document.getElementById('3').value;
    var name = document.getElementById('1').value;
    var address = document.getElementById('4').value;

    
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    db.collection("Operator").add({
        address: address,
        email: email,
        name: name,
        password: password,
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

                        if (doc.data().name) {
                            window.location.href = ('Cuestionario.html');
                        } else {
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
            console.log(user.email);
            listar();
            var db = firebase.firestore();
            let lista = document.getElementById('prob');
            db.collection("Company").where("uid", "==", user.uid)
                .onSnapshot((querySnapshot)=>{
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        // console.log(doc.data().name);
                        lista.innerHTML=doc.data().nombre;
                    });
                })
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
    let lista = document.getElementById('lista');
    
    db.collection("Operator").where("uid", "==", user.uid)
        .onSnapshot((querySnapshot)=> {
            lista.innerHTML = '';
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.data().name);
                lista.innerHTML += `<option value="${doc.id}">${doc.data().name}</option>`
            });
        })
}
function Deleteop() {
    var id = document.getElementById('lista').value;
    var db = firebase.firestore();
    db.collection("Operator").doc(id).delete()
        .then(function () {
           //listar();
            console.log('Usuario eliminidado correctament');

        })
        .catch(function (error) {
            alert('Error al eliminar usuario');
        })
}
function edit() {
    var address = document.getElementById('edit4').value;
    var email = document.getElementById('edit2').value;
    var name = document.getElementById('edit1').value;
    var password = document.getElementById('edit3').value;

    var id = document.getElementById('lista').value;
    var db = firebase.firestore();
    var it = db.collection("Operator").doc(id);
    return it.update({
        address: address,
        email: email,
        name: name,
        password: password
    })
        .then(function () {
           // listar();
            console.log("Document successfully updated!");
        })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
}
function preguntas() {
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    db.collection("Questions").add({
        Company: user.uid,
        Question: document.getElementById('quest1').value + "|" + document.getElementById('quest2').value + "|" + document.getElementById('quest3').value + "|" + document.getElementById('quest4').value + "|" + document.getElementById('quest5').value + "|",
        Answer1: document.getElementById('resp1').value + "|" + document.getElementById('resp4').value + "|" + document.getElementById('resp7').value + "|" + document.getElementById('resp10').value + "|" + document.getElementById('resp13').value,
        Answer2: document.getElementById('resp2').value + "|" + document.getElementById('resp5').value + "|" + document.getElementById('resp8').value + "|" + document.getElementById('resp11').value + "|" + document.getElementById('resp14').value,
        Answer3: document.getElementById('resp3').value + "|" + document.getElementById('resp6').value + "|" + document.getElementById('resp9').value + "|" + document.getElementById('resp12').value + "|" + document.getElementById('resp15').value,
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });

}






