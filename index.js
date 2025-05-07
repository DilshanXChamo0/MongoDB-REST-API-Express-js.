const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Models
const Student = require('./model/Student');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
     .then(() => { console.log('MongoDB connected') })
     .catch(err => { console.log(err) });

app.post('/api/v1/student/save', (req, res) => {

     const { name, age, email } = req.body;
     const student = new Student({ name, age, email });
     student.save()
          .then(() => {
               res.status(200).json({ message: 'Student saved successfully' });
          })
          .catch(err => {
               res.status(500).json({ message: 'Error saving student', error: err });
          });
});

app.get('/api/v1/student/:email', (req, res) => {

     const { email } = req.params;
     Student.findOne({ email }).then((student) => {
          if (student) {
               res.status(200).json(student);

          } else {
               res.status(404).json({ message: 'Student not found' });
          }
     }).catch(error => {
          res.status(500).json({ message: 'Error fetching student', error });
     })
});

app.put('/api/v1/student/:email', (req, res) => {
     const { email } = req.params;
     Student.findOneAndUpdate({ email }, req.body)
          .then((Student) => {
               res.status(200).json({ message: "Student updated!" });
          })
          .catch(() => {
               res.status(404).json({ message: "Somthing went wrong" });
          })
});

app.get('/api/v1/getStudent', async (req, res) => {

     await Student.find()
          .then(Student => {
               res.status(200).json(Student);
          })
          .catch(err => {
               res.status(404).json({ message: "Somthing went wrong" });
          })
});


app.delete('/api/v1/studentDelete/:email', async (req, res) => {

     const { email } = req.params;

     await Student.findOneAndDelete({ email })
          .then(() => {
               res.status(200).json({ message: "Student deleted!" });
          })
          .catch(() => {
               res.status(404).json({ message: "Student not found" })
          })

});


app.listen(process.env.PORT, () => {
     console.log(`Server is running on port ${process.env.PORT}`);
});