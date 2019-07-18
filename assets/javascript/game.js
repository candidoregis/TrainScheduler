const firebaseConfig = {
    apiKey: "AIzaSyDK9MMQvhGU2SF-ou8LYFgljKTgIjCEBvc",
    authDomain: "trainscheduler7-1.firebaseapp.com",
    databaseURL: "https://trainscheduler7-1.firebaseio.com",
    projectId: "trainscheduler7-1",
    storageBucket: "",
    messagingSenderId: "183019342927",
    appId: "1:183019342927:web:ea14bd05e261a570"
};

firebase.initializeApp(firebaseConfig);

// Create a variable to reference the database.
var database = firebase.database();

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

function nextTrainCalc(fitime, freq) {

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(fitime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % freq;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = freq - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
}

$("#addNewTrain").on("click", function () {
    event.preventDefault();

    // Get the input values
    var trainName = $("#inlineFormInputName").val().trim();
    var trainDestination = $("#inlineFormInputDestination").val().trim();
    var trainFirstTime = $("#inlineFormInputTrainTime").val().trim();
    var trainFrequency = parseInt($("#inlineFormInputFrequency").val().trim());

    if (validateTrain(trainName, trainDestination, trainFirstTime, trainFrequency)) {
        console.log("Tente outra vez");
    } else if (trainFirstTimeValidation()) { //function to do
        console.log("Tente outra vez");
    } else {
        console.log("Train name: " + trainName);
        console.log("Train destination: " + trainDestination);
        console.log("Train first time: " + trainFirstTime);
        console.log("Train frequency: " + trainFrequency);
    }


    //pegar valores
    //validar valores
    //associar a variaveis
    //calcular tempo
    //adicionar no gancho
});