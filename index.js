const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();
console.log(process.env.DB_USER);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dz2ta.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const ObjectID = require("mongodb").ObjectID;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const jobsCollection = client.db("job-search").collection("jobs");
  const pendingJobsCollection = client
    .db("job-search")
    .collection("pending-jobs");
  const reviewCollection = client.db("job-search").collection("reviews");
  const adminCollection = client.db("job-search").collection("admin");
  const employeeCollection = client.db("job-search").collection("employee");
  const jobSeekerCollection = client.db("job-search").collection("job-seeker");
  // perform actions on the collection object
  console.log("Database Connected");

  app.get("/jobs", (req, res) => {
    jobsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.delete("/deleteJobs/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    console.log("delete this", id);
    pendingJobsCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(documents.deletedCount > 0));
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.get("/jobsPending", (req, res) => {
    pendingJobsCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  app.post("/pendingJobs", (req, res) => {
    const newJobs = req.body;
    console.log("Adding Jobs", newJobs);
    pendingJobsCollection.insertOne(newJobs).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addJobs", (req, res) => {
    const newJobs = req.body;
    console.log("Adding Jobs", newJobs);
    jobsCollection.insertOne(newJobs).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addReviews", (req, res) => {
    const newReviews = req.body;
    console.log("Adding Reviews", newReviews);
    reviewCollection.insertOne(newReviews).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });
  app.post("/addAdmin", (req, res) => {
    const newAdmin = req.body;
    console.log("Adding Admin", newAdmin);
    adminCollection.insertOne(newAdmin).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addEmployee", (req, res) => {
    const newEmployee = req.body;
    console.log("Adding employee", newEmployee);
    employeeCollection.insertOne(newEmployee).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/addJobSeeker", (req, res) => {
    const newJobSeeker = req.body;
    console.log("Adding employee", newJobSeeker);
    jobSeekerCollection.insertOne(newJobSeeker).then((result) => {
      console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    });
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email }).toArray((err, admin) => {
      res.send(admin.length > 0);
    });
  });

  app.post("/isEmployee", (req, res) => {
    const email = req.body.email;
    console.log(email);
    employeeCollection.find({ email: email }).toArray((err, employee) => {
      res.send(employee.length > 0);
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
