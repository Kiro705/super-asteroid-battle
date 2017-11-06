const Sequelize = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL ||
  'postgres://localhost:5432/superAsteroid', {
    logging: false
  }
);

module.exports = db.define('Score', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

