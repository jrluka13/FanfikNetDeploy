const express = require("express");
const config = require("config");
const path = require('path')
const mongoose = require("mongoose");

const app = express();

const PORT = process.env.PORT || config.get("port")

app.use(express.json({extended: true}))
app.use('/api/auth',require('./routes/auth_routes'))
app.use('/api/book',require('./routes/book.routes'))

if(process.env.NODE_ENV === 'production'){
  app.use('/',express.static(path.join(__dirname,'client','build')))

  app.get('*',((req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  }))
}


async function start() {
  try {
    await mongoose.connect(config.get("mongoUrl"), {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}`);
    });
  } catch (error) {
    console.log("Server erorr", error.message);
    process.exit(1);
  }
}

start();
