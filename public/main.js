var workoutName

async function loadAllWorkouts () {
    let workouts = await $.get("/workouts")
    //Clear page
    $("#exerciseContents").empty();
    $("#workoutContents").empty();
    //Determine if workouts exist
    if (workouts.length == 0) {
        //No workouts exist, create input page
        // $("#workoutContents").css("font-size", "12px").text("You have no active workouts. Please create a new workout.");
        $("<input>").attr({
            id: "newRoutineInput",
            class: "col-10",
            placeholder: "Insert new routine"
        }).appendTo(`#workoutContents`);
        $("<button>").attr({
            class: "input-group-text col-1",
            id: "newRoutineButton"
        }).text("+").insertAfter("#newRoutineInput");
        $("<button>").attr("id","doneRoutine").addClass("my-2").text("Done").insertAfter("#newRoutineButton")
        $("#workoutEditButton").hide();
        $("#newRoutineButton").on("click", createWorkout);
    }
    else {
        //Workouts exist, create workout list
        for ([index, workout] of workouts.entries()) {
            $("<a>").attr({
                class: "list-group-item list-group-item-action routine col-12",
                css: "font-size: 24px",
                id: `routine${index}`
            }).text(workout.workoutName).appendTo("#workoutContents");
        };
        $("<button>").addClass("my-2").attr("id","workoutEditButton").text("Edit").appendTo("#workoutContents");
        $(".list-group-item").on("click", selectWorkout);
        $("#workoutEditButton").on("click", editWorkoutList)
    };
};

function selectWorkout() {
    workoutName = $(this).text();
    $(".list-group-item").removeClass("active");
    $(this).addClass("active");
    loadWorkout();
};

async function createWorkout() {
    let workoutName = $("#newRoutineInput").val();
    let routineID = $(".routine").length;
    if (workoutName == "") {
        if (!$("#workoutError").length) {$("<p>").attr("id","workoutError").text("Please input a workout name").insertAfter("#doneRoutine")};
    }
    else {
        //Append new exercise to list
        $("<a>").attr({
            class: "list-group-item col-10 routine",
            id: `routine${routineID}`
        }).text(workoutName).insertBefore(`#newRoutineInput`);        
        $("<button>").addClass("input-group-text col-1 removeRoutine").text("-").insertAfter(`#routine${routineID}`);
        $("#newRoutineInput").val('');
        data = {name: workoutName};
        $.ajax({
            method: "POST",
            url: "/createWorkout",
            data: data
        });
        $("#workoutError").remove()
        $(".removeRoutine").on("click", deleteWorkout);   
    };
};

async function deleteWorkout() {
    let routineID = $(this).prev().attr("id");
    let workout = $(`#${routineID}`).text();
    let data = {workout: workout};
    $.ajax({
        method: "POST",
        url: "/deleteWorkout",
        data: data
    });
    $(`#${routineID}`).remove();
    $(this).remove();
};

async function editWorkoutList() {
    $(".routine").each( function() {
        $(this).removeClass("col-12");
        $(this).addClass("col-10");
        $("<button>").addClass("input-group-text col-1 removeRoutine text-center").text("-").insertAfter($(this));
    }); 
    //Build input field and edit buttons
    $("<input>").attr({
        id: "newRoutineInput",
        class: "col-10",
        placeholder: "Insert new workout routine here"
    }).appendTo(`#workoutContents`);
    $("<button>").attr({
        class: "input-group-text col-1",
        id: "newRoutineButton"
    }).text("+").insertAfter("#newRoutineInput");
    $("<button>").attr("id","doneRoutine").addClass("my-2").text("Done").insertAfter("#newRoutineButton")
    $("#workoutEditButton").hide();
    //On Clicks
    $("#newRoutineButton").on("click", createWorkout);
    $("#doneRoutine").on("click", loadAllWorkouts);
    $(".removeRoutine").on("click", deleteWorkout);   
};


async function loadWorkout() {
    let exercises = await $.ajax({
        url: "/workout",
        method: "POST",
        data: {name: workoutName}
    });
    $("#exerciseError").remove();
    $("#exerciseContents").empty();
    $("#exerciseContents").text("Exercises")
    if (exercises[0].exercises.length == 0) {
        editWorkout();
    }
    else {
        for ([index, exercise] of exercises[0].exercises.entries()) {
            $("<a>").attr({
                class: "list-group-item col-12 workouts",
                id: `workout${index}`
            }).text(exercise).appendTo(`#exerciseContents`);
        };
        $("<a>").attr({
            class: "row col-12 pr-0 d-flex justify-content-between",
            id: "editRow"
        }).appendTo("#exerciseContents");
        $("<button>").attr("id","editButton").addClass("my-2").text("Edit").appendTo("#editRow");
        $("#editButton").on("click", editWorkout);
    };
};

async function editWorkout() {
    //Check if currently in edit mode
    if ($("#insertRow").length == 0) {
        //Edit list to include "-" buttons
        $(".workouts").each( function() {
            $(this).removeClass("col-12");
            $(this).addClass("col-11");
            $("<button>").addClass("input-group-text col-1 remove text-center").text("-").insertAfter($(this));
        });
        //Build input field and edit buttons
        $("<input>").attr({
            id: "newExercise",
            class: "col-11",
            placeholder: "Insert new exercise here"
        }).appendTo(`#exerciseContents`);
        $("<button>").attr({
            class: "input-group-text col-1",
            id: "newExerciseButton"
        }).text("+").insertAfter("#newExercise");
        $("<button>").attr("id","done").addClass("my-2").text("Done").insertAfter("#newExerciseButton");
        $("#editButton").hide();
        //On Clicks
        $("#newExerciseButton").on("click", addExercise);
        $(".remove").on("click", removeExercise);
        $("#done").on("click", loadWorkout);
    };
};

async function addExercise() {
    currentWorkout = $(".active").text();
    addExercise = $("#newExercise").val();
    workoutID = $(".workouts").length;
    //Check if input field is blank
    if (addExercise == "") {
        if (!$("#exerciseError").length) {$("<p>").attr("id","exerciseError").text("Please input a workout name").insertAfter("#exerciseContents")};
    }
    else {
                    //Check if first exercise, then make list
                    // if ($("#exerciseList").length == 0) {
                    //     $("<ul>").attr({class: "list-group", id: "exerciseList"}).prependTo("#exerciseContents");
                    // };
        //Append new exercise to list
        $("<a>").attr({
            class: "list-group-item col-11 workouts",
            id: `workout${workoutID}`
        }).text(addExercise).insertBefore(`#newExercise`);        
        $("<button>").addClass("input-group-text col-1 remove").text("-").insertAfter(`#workout${workoutID}`);
        $("#newExercise").val('');
        data = {workout: currentWorkout, exercise: addExercise};
        $.ajax({
            method: "POST",
            url: "/addExercise",
            data: data
        });
    };
    $("#exerciseError").remove();
    $(".remove").on("click",removeExercise);
};

async function removeExercise() {
    let exerciseID = $(this).prev().attr("id");
    let exercise = $(`#${exerciseID}`).text();
    let workout = $(".active").text();
    let data = {workout: workout, exercise: exercise};
    $.ajax({
        method: "POST",
        url: "/removeExercise",
        data: data
    });
    //Removing exercise line from DOM
    $(`#${exerciseID}`).remove();
    $(this).remove();
};


loadAllWorkouts();