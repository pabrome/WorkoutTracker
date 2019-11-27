const express = require('express');
const path = require('path');
const mongoose = require("mongoose");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutPlanner", { useNewUrlParser: true });

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    workoutName: {
        type: String
    },
    exercises: [{
        type: String
    }]
});

const workouts = mongoose.model("workouts", workoutSchema);

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/main.html"));
});

app.get("/workouts", async function(req, res) {
   let data = await workouts.find({})
   res.send(data)
});

app.post("/workout", async function(req, res) {
    let data = await workouts.find( {workoutName: req.body.name}, {exercises: 1, _id: 0} )
    res.send(data)
});
 
app.post("/addExercise", async function(req, res) {
    let data = await workouts.updateOne( {workoutName: req.body.workout}, {$push: {exercises: req.body.exercise} } );
});

app.post("/removeExercise", async function(req, res) {
    let data = await workouts.updateOne( {workoutName: req.body.workout}, { $pull: {exercises: req.body.exercise} } );
});

app.post("/createWorkout", async function(req,res) {
    workouts.create({workoutName: req.body.name});
});

app.post("/deleteWorkout", async function(req,res) {
    let data = await workouts.deleteOne({workoutName: req.body.workout});
});