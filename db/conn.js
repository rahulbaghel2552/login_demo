const mongoose = require("mongoose");
mongodb+srv://rahul_baghel:<password>@cluster0.mrbxl.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose
  .connect("mongodb+srv://rahul_baghel:Rahul$125@cluster0.mrbxl.mongodb.net/logindemo?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log(`connection sucessful`);  
  })
  .catch((e) => {
    console.log(`connection unsucessfull`);
  });
