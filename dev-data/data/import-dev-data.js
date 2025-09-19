// This script is independent from the rest of the app and will run ince to get the data from the tours-simple.json file
// to run thid file -> node dev-data/data/import-dev-data.js --import/ --delete

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
const User = require('./../../models/userModel');
const Review = require('./../../models/reviewModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<DB_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

dbConnect()
  .then(() => console.log('Connected'))
  .catch((err) => console.log(err));
async function dbConnect() {
  await mongoose.connect(DB);
}

// Read JSON file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

// Import data into DB
const importData = async () => {
  try {
    // await Tour.create(tours);
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete all data from collection
const deleteData = async () => {
  try {
    // await Tour.deleteMany();
    await Promise.all([
      Tour.deleteMany(),
      User.deleteMany(),
      Review.deleteMany(),
    ]);
    console.log('Data was deleted successfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const updateData = async () => {
  try {
    // Update or insert Tours
    for (const tour of tours) {
      await Tour.updateOne(
        { _id: tour._id }, // match by id
        { $set: tour }, // update with everything in the JSON
        { upsert: true }, // create if not exists
      );
    }

    // Update or insert Users
    for (const user of users) {
      await User.updateOne({ _id: user._id }, { $set: user }, { upsert: true });
    }

    // Update or insert Reviews
    for (const review of reviews) {
      await Review.updateOne(
        { _id: review._id },
        { $set: review },
        { upsert: true },
      );
    }

    console.log('Data successfully updated or inserted!');
  } catch (err) {
    console.error(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
}
if (process.argv[2] === '--delete') {
  deleteData();
}
if (process.argv[2] === '--update') {
  updateData();
}
