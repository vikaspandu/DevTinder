const mongoose  = require('mongoose');

const connect = async () => {
  await mongoose.connect("mongodb+srv://vikaspandey00838:Vikas5097@namastenode.y7yumjw.mongodb.net/Devtinder")}

  module.exports = connect; 