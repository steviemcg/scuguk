import React, { useState } from 'react';
import Button from '../Button';
import cn from 'classnames';

type EnquiryType = 'General' | 'Sponsor' | 'Talk';

// Netlify requires us to render out all fields into HTML for them to be picked up by their form
// analyzer. So rather than not rendering the fields at all, we need to still render optional fields
// but just hide them with CSS.
type EnquiryFieldProps = { show: boolean };

const GeneralEnquiryFields = ({ show }: EnquiryFieldProps) => {
  return (
    <div className={cn({ 'field-hide': !show })}>
      <label htmlFor={'message'}>Message</label>
      <textarea className='input' name={'message'} id={'message'} required={show} />
    </div>
  );
};

const SponsorEnquiryFields = ({ show }: EnquiryFieldProps) => {
  return (
    <>
      <div className={cn({ 'field-hide': !show })}>
        <label htmlFor={'company'}>Company</label>
        <input className='input' name={'company'} id={'company'} required={show} />
      </div>
      <div className={cn({ 'field-hide': !show })}>
        <label htmlFor={'sponsorship'}>Sponsorship</label>
        <p className='input_info'>
          Please provide a brief bit of information about your company and how you&apos;d like to help and we&apos;ll be
          in touch.
        </p>
        <textarea className='input' name={'sponsorship'} id={'sponsorship'} required={show} />
      </div>
    </>
  );
};

const TalkEnquiryFields = ({ show }: EnquiryFieldProps) => {
  return (
    <>
      <div className={cn({ 'field-hide': !show })}>
        <label htmlFor={'talkTitle'}>Talk Title</label>
        <input className='input' name={'talkTitle'} id={'talkTitle'} required={show} />
      </div>
      <div className={cn({ 'field-hide': !show })}>
        <label htmlFor={'talkTeaser'}>Talk Teaser</label>
        <p className='input_info'>
          Tell us a little bit about your talk. Who is it aimed at, will you include a demo, etc.?
        </p>
        <textarea className='input' name={'talkTeaser'} id={'talkTeaser'} required={show} />
      </div>
      <div className={cn({ 'field-hide': !show })}>
        <label htmlFor={'talkLength'}>Talk Length</label>
        <p className='input_info'>How long do you estimate your talk will take?</p>
        <input className='input' name={'talkLength'} id={'talkLength'} required={show} />
      </div>
    </>
  );
};

const ContactForm = () => {
  const [currentEnquiryType, setEnquiryType] = useState<EnquiryType>('General');

  return (
    <section className='form'>
      <p>
        Do you have any questions or feedback? Are you interested in sponsoring or hosting an event? Do you have a great
        idea for a presentation? Leave us a message and we&apos;ll get back to you as soon as possible.
      </p>
      <form name='Contact' method='POST' action='/contact/thanks' data-netlify='true' netlify-honeypot='telephone'>
        <input type='hidden' name='form-name' value='Contact' />
        <fieldset>
          <div>
            <label htmlFor={'name'}>Full Name</label>
            <input className='input' type={'text'} name={'name'} id={'name'} required={true} />
          </div>
          <div>
            <label htmlFor={'email'}>Email</label>
            <input className='input' type={'email'} name={'email'} id={'email'} required={true} />
          </div>
          <div className='hide'>
            {/* Telephone is the honeypot field, we don't need it */}
            <label htmlFor={'telephone'}>Telephone</label>
            <input className='input' type='text' name='telephone' id='telephone' />
          </div>
          <div>
            <label htmlFor={'email'}>Your Enquiry</label>
            <select
              className='select'
              value={currentEnquiryType}
              onChange={(event) => setEnquiryType(event.target.value as EnquiryType)}
              name='enquiryType'
              id='enquiryType'
            >
              <option value='General'>I have a general enquiry</option>
              <option value='Sponsor'>I would like to sponsor an event</option>
              <option value='Talk'>I would like to give a talk</option>
            </select>
          </div>
          <GeneralEnquiryFields show={currentEnquiryType == 'General'} />
          <SponsorEnquiryFields show={currentEnquiryType == 'Sponsor'} />
          <TalkEnquiryFields show={currentEnquiryType == 'Talk'} />
        </fieldset>
        <div className='submit'>
          <Button>Submit</Button>
        </div>
      </form>
    </section>
  );
};

export default ContactForm;
