const Campground = require("../models/campground");
const mongoose = require("mongoose");
const cities = require("./cities");
const axios = require("axios");
const { descriptors, places } = require("./seedsHelper");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Mongo connected");
  })
  .catch((e) => {
    console.log("Mongo Error");
    console.log(e);
  });

const randomFromArray = (array) => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
  try {
    const resp = await axios.get("https://api.unsplash.com/photos/random", {
      params: {
        client_id: "T4lCgmQnWlBJrOj0SBAVKtxfly-Ru01TlF8XCJzcgiE",
        collections: 9046579,
      },
    });
    data = resp.data.urls.small;
    return data;
  } catch (err) {
    console.error(err);
  }
}

const seedData = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price = parseFloat((Math.random() * 40 + 10).toFixed(2));
    // const data = await seedImg();
    const camp = new Campground({
      owner: "61f7a797f97e792989677734",
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${randomFromArray(descriptors)} ${randomFromArray(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam ut, aperiam aliquam et, laboriosam praesentium ullam culpa, ipsam atque quas cupiditate cum rerum tenetur delectus! Debitis obcaecati fuga velit? Rerum?",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dqtx8kikg/image/upload/v1643704848/YelpCamp/zlmwmzanxylyhx4k2r6p.jpg",
          name: "YelpCamp/zlmwmzanxylyhx4k2r6p",
        },
        {
          url: "https://res.cloudinary.com/dqtx8kikg/image/upload/v1643737525/YelpCamp/eykvqlj0gsmwfqavy9hs.jpg",
          name: "YelpCamp/eykvqlj0gsmwfqavy9hs",
        },
      ],
    });
    await camp.save();
  }
};

seedData().then(() => mongoose.connection.close());
