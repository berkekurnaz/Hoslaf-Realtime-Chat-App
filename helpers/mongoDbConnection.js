var mongoose = require("mongoose");

module.exports = () => {

      mongoose.connect("mongodb+srv://" + process.env.DB_USER_NAME + ":" + process.env.DB_USER_PASSWORD + "@" + process.env.DB_CLUSTER_URL + "/" + process.env.DB_NAME + "?retryWrites=true&w=majority");

      mongoose.connection.on('open', () => {
            console.log('MongoDB: Connected');
      });
      mongoose.connection.on('error', (err) => {
            console.log('MongoDB: Error', err);
      });

      mongoose.Promise = global.Promise;
}