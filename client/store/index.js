import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import products from './products'
import product from './product'
import cart from './cart'
import pastOrdersUser from './past-orders-user'
import currentOrdersUser from './current-orders-user'
import orders from './orders'
import users from './users'

const reducer = combineReducers({
  user,
  products,
  product,
  cart,
  pastOrdersUser,
  currentOrdersUser,
  orders,
  users
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './products'
export * from './orders'
export * from './users'
