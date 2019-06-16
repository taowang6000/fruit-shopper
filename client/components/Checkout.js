import React, {Component} from 'react'
import {Form, Dropdown} from 'semantic-ui-react'
import _ from 'lodash'
import faker from 'faker'

const addressDefinitions = faker.definitions.address
const stateOptions = _.map(addressDefinitions.state, (state, index) => ({
  key: addressDefinitions.state_abbr[index],
  text: state,
  value: addressDefinitions.state_abbr[index]
}))

export class Checkout extends Component {
  render() {
    return (
      <div className="checkout-form">
        <Form>
          <Form.Group>
            <Form.Input label="First Name" placeholder="First Name" width={6} />
            <Form.Input label="Last Name" placeholder="Last Name" width={10} />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Address line 1"
              placeholder="Street address, P.O. box, company name, c/o"
              width={16}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="Address line 2"
              placeholder="Apartment, suite, unit, building, floor, etc."
              width={16}
            />
          </Form.Group>
          <Form.Group>
            <Form.Input
              label="City"
              placeholer="City"
              width={8}
              className="margin-right"
            />
          </Form.Group>
        </Form>
        <Form.Group>
          <Dropdown
            label="State"
            search
            selection
            options={stateOptions}
            className="dropdown-height"
          />
        </Form.Group>
        <Form.Group>
          <Form.Input label="ZIP" placeholer="ZIP" width={3} />
        </Form.Group>

        <Form.Group>
          <Form.Input
            label="Phone number"
            placeholder="Phone number"
            width={6}
          />
        </Form.Group>
      </div>
    )
  }
}

export default Checkout