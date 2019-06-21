const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLBoolean
} = require('graphql')
const {
  User,
  Order,
  OrderProduct,
  Review,
  Category,
  CategoryProduct,
  Product
} = require('./models')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const CategoryProductType = new GraphQLObjectType({
  name: 'CategoryProduct',
  fields: () => ({
    categoryId: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    productId: {
      type: new GraphQLNonNull(GraphQLInt)
    }
  })
})

const OrderProductType = new GraphQLObjectType({
  name: 'OrderProduct',
  fields: () => ({
    orderId: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    productId: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    price: {
      type: GraphQLFloat
    },
    quantity: {
      type: GraphQLInt
    }
  })
})

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    name: {
      type: GraphQLString
    },
    products: {
      type: new GraphQLList(ProductType),
      resolve(parent, args) {
        let rowsOfJoinTable = CategoryProduct.findAll({
          where: {
            categoryId: parent.id
          }
        })
        let productsIdArr = rowsOfJoinTable.data.reduce((result, row) => {
          if (!result.includes(row.productId)) result.push(row.prodcutId)
        }, [])
        return Product.findAll({
          where: {
            id: {
              [Op.in]: productsIdArr
            }
          }
        })
      }
    }
  })
})

const ProductType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    name: {
      type: new GraphQLNonNull(GraphQLString)
    },
    price: {
      type: GraphQLFloat
    },
    quantity: {
      type: GraphQLInt
    },
    description: {
      type: GraphQLString
    },
    image: {
      type: GraphQLString
    },
    available: {
      type: GraphQLBoolean
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent, args) {
        return Review.findAll({
          where: {
            productId: parent.id
          }
        })
      }
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve(parent, args) {
        let rowsOfJoinTable = CategoryProduct.findAll({
          where: {
            productId: parent.id
          }
        })
        let catsIdArr = rowsOfJoinTable.data.reduce((result, row) => {
          if (!result.includes(row.categoryId)) result.push(row.categoryId)
        }, [])
        return Category.findAll({
          where: {
            id: {
              [Op.in]: catsIdArr
            }
          }
        })
      }
    }
  })
})

const ReviewType = new GraphQLObjectType({
  name: 'Review',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt)
    },
    text: {
      type: GraphQLString
    },
    rating: {
      type: GraphQLInt
    }
  })
})

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the category.'
    },
    status: {
      type: GraphQLString
    },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findByPk(parent.id)
      }
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    }
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A User',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'The id of the product.'
    },
    email: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    admin: {
      type: GraphQLBoolean
    },
    shippingAdress: {
      type: GraphQLString
    },
    billingAddress: {
      type: GraphQLString
    },
    reset: {
      type: GraphQLBoolean
    },
    createdAt: {
      type: GraphQLString
    },
    updatedAt: {
      type: GraphQLString
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return Order.findAll({
          where: {
            userId: parent.id
          }
        })
      }
    },
    reviews: {
      type: new GraphQLList(ReviewType),
      resolve(parent, args) {
        return Review.findAll({
          where: {
            userId: parent.id
          }
        })
      }
    }
  })
})

let schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      order: {
        type: OrderType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(parent, args) {
          return Order.findbyPk(args.id)
        }
      },
      orders: {
        type: new GraphQLList(OrderType),
        resolve(parent, args) {
          return Order.findAll()
        }
      },
      user: {
        type: UserType,
        // args will automatically be mapped to `where`
        args: {
          id: {
            description: 'id of the user',
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(parent, args) {
          return User.findByPk(args.id)
        }
      },
      product: {
        type: ProductType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLInt)
          }
        },
        resolve(parent, args) {
          return Product.findByPk(args.id)
        }
      }
    }
  })
})

module.exports = schema
