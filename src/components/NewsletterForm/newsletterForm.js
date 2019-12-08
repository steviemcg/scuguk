import React from 'react'

export default class NewsletterForm extends React.Component {
  render() {
    return (
      <form
        action="https://scug.us15.list-manage.com/subscribe/post?u=2f953a15d3e2810c056751401&amp;id=8542525dce"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        className="validate"
        target="_blank"
      >
        <fieldset>
          <div>
            <label htmlFor={'mce-EMAIL'}>
              Email
            </label>
            <input
              className="input"
              type={'email'}
              name={'EMAIL'}
              id={'mce-EMAIL'}
              required={true}
            />
          </div>
          <div>
            <label htmlFor={'mce-FNAME'}>
              First Name
            </label>
            <input
              className="input"
              type={'text'}
              name={'FNAME'}
              id={'mce-FNAME'}
              required={true}
            />
          </div>
          <div>
            <label htmlFor={'mce-LNAME'}>
              Last Name
            </label>
            <input
              className="input"
              type={'text'}
              name={'LNAME'}
              id={'mce-LNAME'}
              required={true}
            />
          </div>
          <div>
            <label htmlFor={'mce-COMPANY'}>
              Company
            </label>
            <input
              className="input"
              type={'text'}
              name={'COMPANY'}
              id={'mce-COMPANY'}
              required={true}
            />
          </div>
          <div>
            <label htmlFor={'mce-JOBTITLE'}>
              Job Title
            </label>
            <input
              className="input"
              type={'text'}
              name={'JOBTITLE'}
              id={'mce-JOBTITLE'}
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
              name={'group[6563][1]'}
              id={'mce-group[6563]-6563-0'}
            />
            <label htmlFor={'mce-group[6563]-6563-0'}>
              London
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'group[6563][2]'}
              id={'mce-group[6563]-6563-1'}
            />
            <label htmlFor={'mce-group[6563]-6563-1'}>
              Bristol
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'group[6563][4]'}
              id={'mce-group[6563]-6563-2'}
            />
            <label htmlFor={'mce-group[6563]-6563-2'}>
              Cardiff
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'group[6563][8]'}
              id={'mce-group[6563]-6563-3'}
            />
            <label htmlFor={'mce-group[6563]-6563-3'}>
              Manchester
            </label>
          </div>
          <div>
            <input
              className="checkbox"
              type={'checkbox'}
              name={'group[6563][16]'}
              id={'mce-group[6563]-6563-4'}
            />
            <label htmlFor={'mce-group[6563]-6563-4'}>
              Leeds
            </label>
          </div>
        </fieldset>
        <div className="submit">
          <button className="button" type="submit">
            Subscribe
          </button>
        </div>
      </form>
    )
  }
}