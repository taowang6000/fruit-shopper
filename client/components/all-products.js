import _ from 'loadsh'
import React from 'react'
import Products from './products'
import {Select, Button, Search, Pagination} from 'semantic-ui-react'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'

class AllProducts extends React.Component {
  constructor(props) {
    super(props)
    this.numberPerPage = 12
    this.selectedCategory = ''
    // options for displayMethod: 'all', 'des', 'inc', 'cat'
    this.initialState = {
      isLoading: false,
      results: [],
      value: '',
      page: 1,
      displayMethod: 'all'
    }
    // products passed for display
    this.products = []
    this.options = [
      'tropical',
      'US-grown',
      'organic',
      'gift',
      'top pick',
      'in season'
    ].map(cat => ({
      key: cat,
      text: cat,
      value: cat
    }))

    this.state = this.initialState
    this.handleDesPriceReorder = this.handleDesPriceReorder.bind(this)
    this.handleIncPriceReorder = this.handleIncPriceReorder.bind(this)
    this.handleSelectByCat = this.handleSelectByCat.bind(this)
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleResultSelect = this.handleResultSelect.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
  }

  handlePageChange(evt, data) {
    this.setState({page: data.activePage})
  }

  handleDesPriceReorder() {
    this.setState({displayMethod: 'des'})
  }

  handleIncPriceReorder() {
    this.setState({displayMethod: 'inc'})
  }

  handleSelectByCat(evt) {
    this.selectedCategory = evt.target.textContent
    this.setState({displayMethod: 'cat', page: 1})
  }

  handleResultSelect(evt, {result}) {
    let link = `/products/${result.id}`
    this.props.toSingleProductPage(link)
  }

  handleSearchChange = (evt, {value}) => {
    this.setState({isLoading: true, value})

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(this.initialState)

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
      const isMatch = result => re.test(result.name)

      this.setState({
        isLoading: false,
        results: _.filter(
          this.props.data.products.map(product => {
            return {
              id: product.id,
              name: product.name,
              title: product.name,
              price: String(product.price),
              image: product.image,
              description: product.description.substr(0, 70)
            }
          }),
          isMatch
        )
      })
    }, 300)
  }

  render() {
    if (this.props.data.loading) {
      return <div> Loading Products ...</div>
    } else {
      switch (this.state.displayMethod) {
        case 'all':
          this.products = this.props.data.products
          break
        case 'des':
          this.products = this.props.data.products
          this.products.sort((a, b) => a.price - b.price)
          break
        case 'inc':
          this.products = this.props.data.products
          this.products.sort((b, a) => a.price - b.price)
          break
        case 'cat':
          this.products = this.props.data.products.filter(elem =>
            elem.categories.some(cat => cat.name === this.selectedCategory)
          )
          break
        default:
          this.products = this.props.data.products
      }
      return (
        <div id="allProductsPage">
          <div>
            <div id="header" />
            <hr />
            <div className="descend-ascend-categories-search-outer">
              <div className="ascending-descending-category-box">
                <Button onClick={this.handleDesPriceReorder}>
                  Descending Price
                </Button>
                <Button onClick={this.handleIncPriceReorder}>
                  Ascending Price
                </Button>
                <Select
                  placeholder="Select by Category"
                  options={this.options}
                  onChange={evt => this.handleSelectByCat(evt)}
                />
              </div>
              <Search
                className="search-bar"
                loading={this.state.isLoading}
                onResultSelect={this.handleResultSelect}
                onSearchChange={_.debounce(this.handleSearchChange, 500, {
                  leading: true
                })}
                results={this.state.results}
                value={this.state.value}
              />
            </div>
            <hr />
            {!this.products || this.products.length === 0 ? (
              <div>No Products!</div>
            ) : (
              <Products
                displayedProducts={this.products
                  .filter(product => product.available === true)
                  .slice(
                    this.numberPerPage * (this.state.page - 1),
                    this.numberPerPage * this.state.page
                  )}
              />
            )}
          </div>

          <div className="pagination-box">
            <Pagination
              className="pagination-item"
              defaultActivePage={1}
              totalPages={Math.ceil(
                this.products.filter(product => product.available === true)
                  .length / this.numberPerPage
              )}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      )
    }
  }
}

const allProductsQuery = gql`
  query {
    products {
      id
      image
      name
      description
      price
      quantity
      available
      categories {
        name
      }
    }
  }
`

export default graphql(allProductsQuery)(AllProducts)
