const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});
process.emitWarning = (warning, ...args) => {
  if (typeof warning === 'string') {
    if (warning.includes('DeprecationWarning')) {
      // Suppress only DeprecationWarnings
      return;
    }
  }
  // For other warnings, use the default behavior
  process.emit('warning', warning, ...args);
};

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

// console.log(DB);
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection successful!')});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 🔴 Shutting Down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

