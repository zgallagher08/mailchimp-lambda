require('dotenv').load()

const Promise = require('es6-promise').Promise
const request = require('superagent')

const API_URL = 'api.mailchimp.com/3.0/lists'
const DATACENTER = process.env.DATACENTER
const API_KEY = process.env.API_KEY
const LIST_ID = process.env.LIST_ID
const USERNAME = process.env.USERNAME

const createSubscription = (email, firstName, lastName, updateExisting = false) => {
  const data = {
    members: [{
      email_address: email,
      status: 'pending',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }],
    update_existing: updateExisting
  }
  return new Promise((resolve, reject) => {
    request.post(`https://${DATACENTER}.${API_URL}/${LIST_ID}`)
      .auth(USERNAME, API_KEY)
      .send(data)
      .end((err, res) => {
        if (err) {
          console.log('ERROR', err);
          reject({ status: err.status, message: err.response.text })
        } else {
          resolve(res.body)
        }
      })
  })
}

const responseObject = (responseBody = {}) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(responseBody)
  }
}

const updateSubscription = (email, firstName, lastName, context, callback) => {
  createSubscription(email, firstName, lastName, true)
    .then((responseBody) => {
      const response = responseObject(responseBody)
      callback(null, response)
    })
    .catch((err) => {
      context.fail(new Error(err))
    })
}

exports.handler = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const { email, firstName, lastName } = body
  createSubscription(email, firstName, lastName)
    .then((responseBody) => {
      if (responseBody && responseBody.total_created === 0 && responseBody.total_updated === 0) {
        updateSubscription(email, firstName, lastName, context, callback)
      } else {
        const response = responseObject(responseBody)
        callback(null, response)
      }
    })
    .catch((err) => {
      context.fail(new Error(err))
    })
}
