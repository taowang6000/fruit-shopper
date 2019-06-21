const Sequelize = require('sequelize')
const db = require('../db')

const Order = db.define('order', {
  // change status from enum to string, because graphql does not recogenize this type
  status: {
    // type: Sequelize.ENUM(
    //   'cart',
    //   'created',
    //   'processing',
    //   'cancelled',
    //   'completed'
    // )
    type: Sequelize.STRING
  }
})

module.exports = Order
