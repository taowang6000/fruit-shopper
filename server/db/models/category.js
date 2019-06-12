const Sequelize = require('sequelize')
const db = require('../db')

const Category = deb.define('category', {
  name: {
    type: Sequelize.ENUM(
      'citrus',
      'berries',
      'melons',
      'pomes',
      'tropical',
      'US-grown',
      'organic'
    )
  }
})

module.exports = Category
