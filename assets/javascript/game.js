// 
const firebaseConfig = {
    apiKey: "AIzaSyDK9MMQvhGU2SF-ou8LYFgljKTgIjCEBvc",
    authDomain: "trainscheduler7-1.firebaseapp.com",
    databaseURL: "https://trainscheduler7-1.firebaseio.com",
    projectId: "trainscheduler7-1",
    storageBucket: "trainscheduler7-1.appspot.com",
    messagingSenderId: "183019342927",
    appId: "1:183019342927:web:ea14bd05e261a570"
};

//
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

//
function validateTrain(name, dest, ftime, freq) {
    var isValid = ((name === "") || (dest === "") || (ftime === "") || (freq === ""));
    return isValid;
}

// 
function minAwayCalc(fitime, freq) {
    var firstTimeConverted = moment(fitime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % freq;
    var tMinutesTillTrain = freq - tRemainder;
    return tMinutesTillTrain;
}

// 
function nextTrainCalc(minutes) {
    var nextTrain = moment().add(minutes, "minutes");
    return moment(nextTrain).format("hh:mm");
}

// 
function timeLengthValidation(inputField) {
    var isValid = (inputField.length == 4);
        return isValid;
}

// 
function timeValidation(inputField) {
    if (inputField == "2400") {
        inputField = 0000;
    }
    var isTimeValid = /^([0-1]?[0-9]|2[0-3])([0-5][0-9])?$/.test(inputField);
    return isTimeValid;
}

// 
function frequencyValidation(inputField) {
    var isFreqValid = /^[0-9]+$/.test(inputField);
    return isFreqValid;
}

//
function retrieveData() {
    $("#trainSchedules").empty();
    var query = firebase.database().ref();
    query.once("value")
        .then(function (snapshot) {

            // Go through all children in DB and retrieving data
            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                addData(childData);
            });
        });
}

// 
function addData(data) {
    var name = data.trainName;
    var destination = data.trainDestination;
    var frequency = data.trainFrequency;
    var firstTime = data.trainFirstTime;
    var minutesAway = minAwayCalc(firstTime, frequency);
    var nextTrain = nextTrainCalc(minutesAway);

    // Creating a variable to hold the data before appending it
    var newRow = $("<tr>").append(
        $("<td>").text(name),
        $("<td>").text(destination),
        $("<td>").text(frequency),
        $("<td>").text(nextTrain),
        $("<td>").text(minutesAway)
    );

    // Append the new row to the table
    $("#trainSchedules").append(newRow);
}

$("#addNewTrain").on("click", function () {
    event.preventDefault();

    // Get the input values
    var trainName = $("#inlineFormInputName").val().trim();
    var trainDestination = $("#inlineFormInputDestination").val().trim();
    var trainFirstTime = $("#inlineFormInputTrainTime").val().trim();
    var trainFrequency = $("#inlineFormInputFrequency").val().trim(); 

    // Validate entries, if good add to DB
    if (validateTrain(trainName, trainDestination, trainFirstTime, trainFrequency)) {
        $('#exampleModal').modal('show');
    } else if ((timeLengthValidation(trainFirstTime))
        && (timeValidation(trainFirstTime))
        && (frequencyValidation(trainFrequency))) {
        database.ref().push({
            trainName: trainName,
            trainDestination: trainDestination,
            trainFirstTime: trainFirstTime,
            trainFrequency: trainFrequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    } else {
        $('#exampleModal').modal('show');
    }

    retrieveData();
});

retrieveData();