# MailChimp Lambda

Lambda function for creating MailChimp subscriptions with email, first name, and last name.

##  Configuration

Create a `.env` file and set your MailChimp API key, List ID, and username. See .env.example

For reference, [here](http://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/) is the MailChimp API documentation.

## Deployment

To create your zip archive, run the following npm script:

```
$ npm run zip
```

Integrate with the
[AWS API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
to access the function via HTTP POST:

```
$ curl -X POST -H "Content-Type: application/json" \
-d '{ "email": "example@gmail.com", "firstName": "Bruce", "lastName": "Wayne" }' \
API_GATEWAY_URL
```