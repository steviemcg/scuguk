import React from 'react'

export default class contactForm extends React.Component {
  render() {
    return (
      <form
        name="Contact"
        method="POST"
        action="/contact/thanks"
        data-netlify="true"
        netlify-honeypot="company"
      >
        <input type="hidden" name="form-name" value="Contact" />
        <fieldset>
          <div>
            <label htmlFor={'name'}>
              Full Name
            </label>
            <input
              className="input"
              type={'text'}
              name={'name'}
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
              id={'email'}
              required={true}
            />
          </div>
          <div className="hide">
            {/* Company is the honeypot field, we don't need it */}
            <label htmlFor={'company'}>
              Company
            </label>
            <input
              className="input"
              type='text'
              name='company'
              id='company'
            />
          </div>
          <div>
            <label htmlFor={'message'}>
              Message
            </label>
            <textarea
              className="input"
              name={'message'}
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