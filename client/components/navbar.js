import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import AccountManagementUser from '../components/AccountManagementUser'

const Navbar = ({handleClick, isLoggedIn, isAdmin}) => (
  <div>
    <h1>Welcome to Fruit-Shopper!</h1>
    <nav>
      {!isLoggedIn &&
        !isAdmin && (
          <div>
            <Link to="/home">Home</Link>
            <Link to="/products">All Products</Link>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
            <Link to="/cart">My Cart</Link>
          </div>
        )}
      {isLoggedIn &&
        !isAdmin && (
          <div>
            <Link to="/home">Home</Link>
            <Link to="/products">All Products</Link>
            <AccountManagementUser />
            <Link to="/cart">My Cart</Link>
          </div>
        )}
      {isAdmin && (
        <div>
          <Link to="/home">Home</Link>
          <Link to="/products">All Products</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
          <AccountManagementUser />
          <Link to="/manageProducts">Manage Products</Link>
          <Link to="/manageOrders">Manage Orders</Link>
          <Link to="/manageUsers">Manage Users</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    isAdmin: !!state.user.id && state.user.admin === true
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(Navbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
