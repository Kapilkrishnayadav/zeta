const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose
  .connect(
    "mongodb+srv://yadavkapil2336:yadav2@cluster0.ek5syoj.mongodb.net/placementproject"
  )
  .then(() => {
    console.log("running succesfully");
  })
  .catch((err) => {
    console.log(err);
  });
const Schema = mongoose.Schema;

