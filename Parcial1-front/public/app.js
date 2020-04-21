
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
                    firebase.storage().ref('image/'+user.uid).put(img);
                    signout();
                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario registrado, ya puede ingresar',
                    })
                   
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
            firebase.storage().ref('image/Operador/'+docRef.id).put(img2);
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });
}

function login() {
    event.preventDefault();
    var email2 = document.getElementById('emaill').value;
    var password2 = document.getElementById('passwordl').value;
    firebase.auth().signInWithEmailAndPassword(email2, password2)
        .then(function (val) {
            var user = firebase.auth().currentUser;
            window.location.href = ('Operadores.html');
           
           

        }, function (reason) {
            var db = firebase.firestore();
            var sw=false;
            db.collection("Operator").where("email", "==", email2).where("password", "==", password2)
                .get()
                .then(function (querySnapshot) {
                    
                    querySnapshot.forEach(function (doc) {
                        sw=true;
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.data().name);

                        if (doc.data().name && doc.data().type==1) {
                            window.location.href = ('Cuestionario.html?operator='+doc.id);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Usuario deshabilitado',
                            });
                        }
                    });
                    if(!sw){
                        Swal.fire({
                            icon: 'error',
                            title: 'Usuario o contraseña invalida',
                        });
                    }
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });
                
        
        });
}
function obs() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            loadimg(user.uid);
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
    if(id){
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
}
function showedit(){
    var id = document.getElementById('lista').value;
    if(id){
        var db = firebase.firestore();
    let address = document.getElementById('edit4');
    let email = document.getElementById('edit2');
    let name = document.getElementById('edit1');
    let password = document.getElementById('edit3');
    db.collection("Operator").doc(id)
            .get()
            .then(function (doc) {
                address.value=doc.data().address;
                email.value=doc.data().email;
                name.value=doc.data().name;
                password.value=doc.data().password;
            })
            .catch(function (error) {
                alert('Error');
            })  
    }
    
}
function edit() {
    var id = document.getElementById('lista').value;
    if(id){
        var address = document.getElementById('edit4').value;
    var email = document.getElementById('edit2').value;
    var name = document.getElementById('edit1').value;
    var password = document.getElementById('edit3').value;

    
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
    
}

function verfanswer(type){
    var r1=document.getElementsByName(type);
    let answer;
    for(i=0;i<r1.length;i++){
        if(r1[i].checked){
            answer=i+1;
        }
    }
    return answer;
}


function preguntas() {
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;

    const r1=verfanswer('answer1');
    const r2=verfanswer('answer2');
    const r3=verfanswer('answer3');
    const r4=verfanswer('answer4');
    const r5=verfanswer('answer5');



    db.collection("Questions").add({
        Company: user.uid,
        answer: r1+"|"+r2+"|"+r3+"|"+r4+"|"+r5,
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

// funcion donde creo el cuestionario por empresa
function cuestionario(uid) {
    var db = firebase.firestore();
    let p1 = document.getElementById('question1');
    let p2 = document.getElementById('question2');
    let p3 = document.getElementById('question3');
    let p4 = document.getElementById('question4');
    let p5 = document.getElementById('question5');
    let p11 = document.getElementById('p11');
    let p12 = document.getElementById('p12');
    let p13 = document.getElementById('p13');
    let p21 = document.getElementById('p21');
    let p22 = document.getElementById('p22');
    let p23 = document.getElementById('p23');
    let p31 = document.getElementById('p31');
    let p32 = document.getElementById('p32');
    let p33 = document.getElementById('p33');
    let p41 = document.getElementById('p41');
    let p42 = document.getElementById('p42');
    let p43 = document.getElementById('p43');
    let p51 = document.getElementById('p51');
    let p52 = document.getElementById('p52');
    let p53 = document.getElementById('p53');


    db.collection("Questions").where("Company", "==", uid)
        .onSnapshot((querySnapshot) => {
            p1.innerHTML = '';
            p2.innerHTML = '';
            p3.innerHTML = '';
            p4.innerHTML = '';
            p5.innerHTML = '';
            p12.innerHTML = '';
            p13.innerHTML = '';
            p11.innerHTML = '';
            p21.innerHTML = '';
            p22.innerHTML = '';
            p23.innerHTML = '';
            p31.innerHTML = '';
            p32.innerHTML = '';
            p33.innerHTML = '';
            p41.innerHTML = '';
            p42.innerHTML = '';
            p43.innerHTML = '';
            p51.innerHTML = '';
            p52.innerHTML = '';
            p53.innerHTML = '';
            querySnapshot.forEach(function (doc) {
                // doc.data() is never undefined for query doc snapshots
                // console.log(doc.data().name);
                var str = doc.data().Question;
                var res = str.split("|");
                var str1 = doc.data().Answer1;
                var res1 = str1.split("|");
                var str2 = doc.data().Answer2;
                var res2 = str2.split("|");
                var str3 = doc.data().Answer3;
                var res3 = str3.split("|");
                p1.innerHTML += `<h4>${res[0]}</h4>`
                p2.innerHTML += `<h4>${res[1]}</h4>`
                p3.innerHTML += `<h4>${res[2]}</h4>`
                p4.innerHTML += `<h4>${res[3]}</h4>`
                p5.innerHTML += `<h4>${res[4]}</h4>`
                p11.innerHTML = res1[0];
                p12.innerHTML = res2[0];
                p13.innerHTML = res3[0];
                p21.innerHTML = res1[1];
                p22.innerHTML = res2[1];
                p23.innerHTML += res3[1];
                p31.innerHTML += res1[2];
                p32.innerHTML += res2[2];
                p33.innerHTML += res3[2];
                p41.innerHTML += res1[3];
                p42.innerHTML += res2[3];
                p43.innerHTML += res3[3];
                p51.innerHTML += res1[4];
                p52.innerHTML += res2[4];
                p53.innerHTML += res3[4];
            });
        })
}

function rcuppass() {
    var correo = document.getElementById("edit4").value;//aqui iria el campo de donde se lee el correo
    firebase.auth().sendPasswordResetEmail(correo)
        .then(function () {
            // Password reset email sent.
        })
        .catch(function (error) {
            // Error occurred. Inspect error.code.
        });
}

function config(){
    let s=window.location.search.split('=');
    if(!s[1]){
        location.replace("index.html");
    }else{
        var db = firebase.firestore();
        db.collection("Operator").doc(s[1])
            .get()
            .then(function (doc) {
                loadimgop(doc.id);
                cuestionario(doc.data().uid);
                let lista = document.getElementById('prob');
                lista.innerHTML=doc.data().name;
                
            })
            .catch(function (error) {
                alert('Error');
            })   
    }
}

function close(){
    window.location.href('index.html');
}

function listener(){
    document.getElementById("lista").addEventListener("change", update);
    
}
function update(){
    //console.log(document.getElementById("lista").value);
    var db = firebase.firestore();
    db.collection("Operator").doc(document.getElementById("lista").value).get()
        .then(function(doc) {
            let lista = document.getElementById('pk22');
            if(doc.data().type==1){
                lista.innerHTML='Deshabilitar';
            }else{
                lista.innerHTML='Habilitar';
            }
        })
}
function enable(){
    const val=document.getElementById("lista").value;
    const val2=document.getElementById("pk22");
    
    //console.log(val2.innerHTML+val);
    if(val && val2.innerHTML){
        
        let Type;
        if(val2.innerHTML=='Deshabilitar'){
            Type=0;
        }else{
            Type=1;
        }
        //console.log(Type);
        var db = firebase.firestore();
        var it = db.collection("Operator").doc(val);
        return it.update({
            type: Type
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
}

function draw(){
    google.charts.load("current", {packages:["corechart"]});
    google.charts.setOnLoadCallback(drawChart);
}
function drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Task', 'Resultados'],
      ['Acertado',     4],
      ['Equivocado',   1]
    ]);

    var options = {
      title: 'Resultados',
      width: 470,
      height:400,
      is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
  }

var img;
function saveimg(event){
   img= event.target.files[0];
}

function loadimg(doc){
    firebase.storage().ref().child('image/'+doc).getDownloadURL().then(function(url) {
        const img2 = document.getElementById('imgnav');
        img2.src=url;
    }).catch(function(err){
        console.log(err);
    });
}

var img2;
function saveimgop(){
    img2=event.target.files[0];
}

function loadimgop(doc){
    firebase.storage().ref().child('image/Operador/'+doc).getDownloadURL().then(function(url) {
        const img3 = document.getElementById('imgnavop');
        img3.src=url;
    }).catch(function(err){
        console.log(err);
    });
}