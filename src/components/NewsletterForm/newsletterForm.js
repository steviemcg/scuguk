import React from 'react'
import { navigate } from 'gatsby-link'

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&')
}

export default class NewsletterForm extends React.Component {
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
        action="https://scug.us15.list-manage.com/subscribe/post?u=2f953a15d3e2810c056751401&amp;id=8542525dce" 
        method="post" 
        id="mc-embedded-subscribe-form" 
        name="mc-embedded-subscribe-form" 
        class="validate" 
        target="_blank" 
        novalidate
        //onSubmit={this.handleSubmit}
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
            <label htmlFor={'company'}>
              Company
            </label>
              <input
                className="input"
                type={'text'}
                name={'company'}
                onChange={this.handleChange}
                id={'company'}
                required={true}
              />
          </div>
          <div>
            <label htmlFor={'jobTitle'}>
              Job Title
            </label>
              <input
                className="input"
                type={'text'}
                name={'jobTitle'}
                onChange={this.handleChange}
                id={'jobTitle'}
                required={true}
              />
            </div>
        </fieldset>
        <fieldset>
          <p>Which region would you like updates for?</p>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'london'}
              onChange={this.handleChange}
              id={'london'}
            />
            <label htmlFor={'london'}>
              London
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'bristol'}
              onChange={this.handleChange}
              id={'bristol'}
            />
            <label htmlFor={'bristol'}>
              Bristol
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'cardiff'}
              onChange={this.handleChange}
              id={'cardiff'}
            />
            <label htmlFor={'cardiff'}>
              Cardiff
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'manchester'}
              onChange={this.handleChange}
              id={'manchester'}
            />
            <label htmlFor={'manchester'}>
              Manchester
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'leeds'}
              onChange={this.handleChange}
              id={'leeds'}
            />
            <label htmlFor={'leeds'}>
              Leeds
            </label>
          </div>
        </fieldset>        
        <div class="submit">
          <button className="button" type="submit">
            Subscribe
          </button>
        </div>          
      </form>
    )
  }
}


// {/* <form >

// <div id="mc_embed_signup_scroll">

// <div class="mc-field-group">
//   <label for="mce-EMAIL">Email Address </label>
//   <input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" />
// </div>
// <div class="mc-field-group">
//   <label for="mce-FNAME">First Name </label>
//   <input type="text" value="" name="FNAME" class="required" id="mce-FNAME" />
// </div>
// <div class="mc-field-group">
//   <label for="mce-LNAME">Last Name </label>
//   <input type="text" value="" name="LNAME" class="required" id="mce-LNAME" />
// </div>
// <div class="mc-field-group">
//   <label for="mce-COMPANY">Company </label>
//   <input type="text" value="" name="COMPANY" class="required" id="mce-COMPANY" />
// </div>
// <div class="mc-field-group">
//   <label for="mce-JOBTITLE">Job Title </label>
//   <input type="text" value="" name="JOBTITLE" class="required" id="mce-JOBTITLE" />
// </div>
// <div class="mc-field-group input-group">
//   <strong>Which regions would you like updates for? </strong>
//   <ul><li><input type="checkbox" value="1" name="group[6563][1]" id="mce-group[6563]-6563-0" /><label for="mce-group[6563]-6563-0">London</label></li>
//     <li><input type="checkbox" value="2" name="group[6563][2]" id="mce-group[6563]-6563-1" /><label for="mce-group[6563]-6563-1">Bristol</label></li>
//     <li><input type="checkbox" value="4" name="group[6563][4]" id="mce-group[6563]-6563-2" /><label for="mce-group[6563]-6563-2">Cardiff</label></li>
//     <li><input type="checkbox" value="8" name="group[6563][8]" id="mce-group[6563]-6563-3" /><label for="mce-group[6563]-6563-3">Manchester</label></li>
//     <li><input type="checkbox" value="16" name="group[6563][16]" id="mce-group[6563]-6563-4" /><label for="mce-group[6563]-6563-4">Leeds</label></li>
//   </ul>
// </div>
// <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_2f953a15d3e2810c056751401_8542525dce" tabindex="-1" value="" /></div>
// <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button" /></div>
// </div>
// </form> */}