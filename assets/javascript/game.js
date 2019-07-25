const firebaseConfig = {
    apiKey: "AIzaSyDK9MMQvhGU2SF-ou8LYFgljKTgIjCEBvc",
    authDomain: "trainscheduler7-1.firebaseapp.com",
    databaseURL: "https://trainscheduler7-1.firebaseio.com",
    projectId: "trainscheduler7-1",
    storageBucket: "trainscheduler7-1.appspot.com",
    messagingSenderId: "183019342927",
    appId: "1:183019342927:web:ea14bd05e261a570"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();



var randomDate = "02/23/1999";
var randomFormat = "MM/DD/YYYY";
var convertedDate = moment(randomDate, randomFormat);
// console.log(convertedDate);




// All of our connections will be stored in this directory.
// var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
// var connectedRef = database.ref(".info/connected");

// connectedRef.on("value", function (snap) {

//     // If they are connected..
//     if (snap.val()) {

//         // Add user to the connections list.
//         var con = connectionsRef.push(true);
//         // Remove user from the connection list when they disconnect.
//         con.onDisconnect().remove();
//     }
// });

// When first loaded or when the connections list changes...
// connectionsRef.on("value", function (snap) {

//     // Display the viewer count in the html.
//     // The number of online users is the number of children in the connections list.
//     $("#connected-viewers").text(snap.numChildren());
// });

// -----

function validateTrain(name, dest, ftime, freq) {
    if ((name === "") || (dest === "") || (ftime === "") || (freq === "")) {
        return true;
    } else {
        return false;
    }
}

function minAwayCalc(fitime, freq) {
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(fitime, "HH:mm").subtract(1, "years");
    // console.log(firstTimeConverted);
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);
    var tRemainder = diffTime % freq;
    // console.log(tRemainder);
    var tMinutesTillTrain = freq - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    return tMinutesTillTrain;
}

function nextTrainCalc(minutes) {
    var nextTrain = moment().add(minutes, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    return moment(nextTrain).format("hh:mm");
}

function timeLengthValidation(inputField) {
    console.log("length: " + inputField.length);
    if (inputField.length == 4) {
        return true;
    } else {
        return false;
    }
}

function timeValidation(inputField) {
    if (inputField == "2400") {
        inputField = 0000;
    }
    var isTimeValid = /^([0-1]?[0-9]|2[0-3])([0-5][0-9])?$/.test(inputField);
    return isTimeValid;
}

function frequencyValidation(inputField) {
    var isFreqValid = /^[0-9]+$/.test(inputField);
    return isFreqValid;
}

function retrieveData() {
    console.log("entrei no retrieve");
    var query = firebase.database().ref();
    console.log(query);
    query.once("value")
        .then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                // key will be "ada" the first time and "alan" the second time
                var key = childSnapshot.key;
                // console.log(key);
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
                // console.log(childData);
                addData(childData);
            });
        });
}

function addData(data){
    var name = data.trainName;
    var destination = data.trainDestination;
    var frequency = data.trainFrequency;
    var firstTime = data.trainFirstTime;
    var minutesAway = minAwayCalc(firstTime, frequency);
    var nextTrain = nextTrainCalc(minutesAway);
    console.log(name);

}

$("#addNewTrain").on("click", function () {
    event.preventDefault();

    // Get the input values
    var trainName = $("#inlineFormInputName").val().trim();
    var trainDestination = $("#inlineFormInputDestination").val().trim();
    var trainFirstTime = $("#inlineFormInputTrainTime").val().trim();

    // var trainFrequency = parseInt($("#inlineFormInputFrequency").val().trim());
    var trainFrequency = $("#inlineFormInputFrequency").val().trim(); //need to parseInt later

    // Validate entries
    if (validateTrain(trainName, trainDestination, trainFirstTime, trainFrequency)) {
        console.log("Tente outra vez");
        //DISPLAY MODAL PARA INSERIR DADOS VALIDOS
    } else if ((timeLengthValidation(trainFirstTime))
        && (timeValidation(trainFirstTime))
        && (frequencyValidation(trainFrequency))) {
        console.log("entrei ");
        database.ref().push({
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstTime: trainFirstTime,
            trainFrequency: trainFrequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    } else {
        console.log("UUAAAAAAAAAAAAAAAAA");
    }
    
    retrieveData();
    console.log("depois");
    //pegar valores
    //validar valores
    //associar a variaveis
    //calcular tempo
    //adicionar no gancho
});