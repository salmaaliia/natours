const fs = require('fs');
const express = require('express');

const app = express();

// middleware: a function that can modify the incomming data, it stands between in the middle of the request and the response. It is a step that the request is going throw while it is being processed. the data from the request body is added to the request object
app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// parameters -> /:x
// optional parameters -> /:y?
// the callback function -> route handler
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);

  const id = +req.params.id;
  const tour = tours.find((t) => t.id === id);

  //if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

// can send request from the client to the server and the data is available in the req
app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // assign merges 2 objects

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 status code means sent
      res.status(201).send({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );

  // res.send('Done'); // cann't send 2 responses
});

// we actually have two http methods to update data. We have put and we have patch. And with put, we expect that our application receives the entire new updated object, and with patch, we only expect the properties that should actually be updated on the object

app.patch('/api/v1/tours/:id', (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }
  // 204: no content
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
