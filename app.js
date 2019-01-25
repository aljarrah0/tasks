const express = require('express');

const Joi = require('joi');

const app = express();

app.use(express.json())
let port = process.env.port || 5000;

let courses = [
    { id: 1, name: 'javascript' },
    { id: 2, name: 'HTML5' },
    { id: 3, name: 'CSS3' },
    { id: 4, name: 'NodeJS' },
]

app.get('/', (req, res) => {
    res.send("Hi World");
})
// Get All courses
app.get('/courses', (req, res) => {
    res.send(courses)
});

// Get course For ID
app.get('/courses/:id', (req, res) => {
    let course = validateCourseById(req.params.id);
    if (!course) res.status(404).send("Not Found");
    else res.send(course);
});

// Delete course For ID
app.delete('/courses/:id', (req, res) => {
    let course = validateCourseById(req.params.id);
    if (!course) res.status(404).send("This courses Is Not Found");
    else courses.splice(courses.indexOf(course), 1);
    res.send(course);
});

// Post course
app.post('/courses', (req, res) => {
    // check the date valide

    let result = validateCourse(req.body);
    if (result.error)
        res.status(400).send(result.error.details[0].message)

    // if(!req.body.name || req.body.name.length < 3){   
    // res.status(400).send("the name of course is require and min length is 3")
    // }

    // 1 : Create course
    else {
        let course = {
            id: courses.length + 1,
            name: req.body.name
        }
        courses.push(course);
        res.send(course);
    }
});

// Pudate courses
app.put('/courses/:id', (req, res) => {
    // 1 Look Up (find) The course
    // 2 If Not exisiting, Return 400 (Not Found)
    let course = validateCourseById(req.params.id);
    if (!course) res.status(404).send("The courses Not Found");

    // 3 validate ===> if invalid ===> Return 400 (Bad Request)

    let result = validateCourse(req.body);
    if (result.error) res.status(400).send(result.error.details[0].message)
    // 4 Update The course
    else course.name = req.body.name;
    // 5 Return The Update course
    res.send(course);
});

// Functions For APIs
function validateCourseById(Pid) {
    return courses.find(p => p.id === parseInt(Pid));
}

function validateCourse(course) {
    let schema = {
        name: Joi.string().min(5).required()
    }
    return Joi.validate(course, schema);
}

app.listen(port);