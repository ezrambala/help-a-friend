import React from 'react'
import "./registerevent.css"

const RegisterEvent = () => {
  return (
    <div className='register-event-container'>
        <h1 className='dp-heading-font-family'>Register An Event</h1>
        <form  className='register-event-form'>
            <input className='ev-reg-input' type='text' placeholder='Enter Event Name' required></input>
            <input className='ev-reg-input' type='text' placeholder='Enter Event Description' required></input>
            <div>
                <div>Event Date</div>
                <input className='ev-reg-input' type='datetime-local'  required></input>
            </div>
            <input className='ev-reg-input' type='text' placeholder='Enter Website'></input>
            <button className='ev-reg-submit' type='submit'> Submit </button>
        </form>
    </div>
  )
}

export default RegisterEvent