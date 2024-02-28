const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('testedois', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres'
})

try {
  sequelize.authenticate()
  console.log('Database connect')
} catch (error) {
  console.log('DB reject Connection!')
}

module.exports = sequelize;