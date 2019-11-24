import React from 'react'
import { navigate } from 'gatsby-link'

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default class contactForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isValidated: false }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit = e => {
    e.preventDefault()
    const form = e.target
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
      .then(() => navigate(form.getAttribute('action')))
      .catch(error => alert(error))
  }

  render() {
    return (
      <form        
        name="Contact"
        method="post"
        action="/ContactForm/thanks/"
        data-netlify="true"
        data-netlify-honeypot="name"
        onSubmit={this.handleSubmit}
      > 
        <fieldset>
          {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
          <div className="hide">
            <label>
              Please enter your name:
              <input name="name" onChange={this.handleChange} />
            </label>
            <input type="hidden" name="form-name" value="contact" />
          </div>            
          <div>
            <label htmlFor={'name'}>
              Full Name
            </label>
              <input
                className="input"
                type={'text'}
                name={'name'}
                onChange={this.handleChange}
                id={'name'}
                required={true}
              />
          </div>
          <div>
            <label htmlFor={'email'}>
              Email
            </label>
              <input
                className="input"
                type={'email'}
                name={'email'}
                onChange={this.handleChange}
                id={'email'}
                required={true}
              />
          </div>
          <div>
            <label htmlFor={'message'}>
              Message
            </label>
              <textarea
                className="input"
                name={'message'}
                onChange={this.handleChange}
                id={'message'}
                required={true}
              />
            </div>
        </fieldset>
        <div className="submit">
          <button className="button" type="submit">
            Submit
          </button>
        </div>          
      </form>
    )
  }
}