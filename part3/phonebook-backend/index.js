require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person.js");

const app = express();

morgan.token("post-info", (request, response) => {
  if (request.method === "POST") {
    return JSON.stringify(request.body);
  } else {
    return "";
  }
});

const logger = morgan(
  ":method :url :status :res[content-length] - :response-time ms :post-info"
);

app.use(express.static("../build"));
app.use(express.json());
app.use(cors());
app.use(logger);

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/info", (request, response, next) => {
  Person.find({})
    .then((persons) => {
      const date = new Date();
      const numOfPeopleInfo = `<p>The phonebook has information for ${persons.length} people</p><p>${date}</p>`;
      response.send(numOfPeopleInfo);
    })
    .catch((error) => {
      next(error);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findById({ id })
    .then((person) => {
      response.json(person);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndRemove(id)
    .next((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
  const receivedObj = request.body;
  const id = request.params.id;

  const person = {
    name: receivedObj.name,
    number: receivedObj.number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((result) => {
      response.json(result);
    })
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const newId = Math.ceil(Math.random() * 2000000000000000);
  const receivedInfo = request.body;

  if (!receivedInfo.name || !receivedInfo.number) {
    response
      .status(400)
      .json("Missing name or number. Please input a name and a number!");
  }

  const person = new Person({
    id: newId,
    name: receivedInfo.name,
    number: receivedInfo.number,
  });

  person
    .save()
    .then((returnedObj) => {
      response.json(returnedObj);
    })
    .catch((error) => {
      console.log(error);
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(400).send({ error: "Unknown Endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  const errorMessage = error.message;
  console.log("Error : ", errorMessage);
  if (error.name === "CastError") {
    response.status(400).send({ error: "Malformatted Id" });
  }

  if (error.name === "ValidationError") {
    response.status(400).json({ error: errorMessage });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}\n`);
});
