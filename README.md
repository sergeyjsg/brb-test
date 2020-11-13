BrokerBay test task by Sergey
---

## How to Run
* Make sure nodejs >= 14 installed
* Make sure typescript installed globally (tsc -v should return version). This project tested and compiled on typescript version 3.6.3
* `git clone git@github.com:sergeyjsg/brb-test.git`
* `cd brb-test` 
* `npm install --also=dev`
* `npm run compile`
* `npm test`
* `npm start` ==> App will listen for HTTP requests on `0.0.0.0:8000`

## Skipped parts
There are some skipped parts in this codebase. They are skipped because of the lack of time. Please let me know if they should be added or reach me out directly to discuss certain decisions. 
* Comments - Unfortunately task time already exceeded several hours and will not have time to ccover most of the codebase
* Functional Tests - Listing service not covered by functional tests, functional tests examples can be found for Users service
* Unit tests - Skipped in favor of functional and integration test
* Linter - ESLint with a typescript plugin can always be added for a specific set of rules  
* Some Examples - For instance some list endpoints supports offset and limit query params. Not all examples covered in integration tests
* Validation - Some input params, output params, some intermediate checks for object existence / non empty arrays  

## Application Architecture
Classic N-tier architecture ws chosen for this project. 
Layers represented as follows:
* Messages - Presentation (Object Mapping Layer)
* Services - Logical (HTTP handlers)
* Classes & Utils - Logical (Business & App Logic)
* Models - Data Access Layer (Object Relational Mapping)
* Providers - Data Access Layer
* SQLite - Persistence Layer (In memory DB)

## Application Entrypoint
`src/index.ts`

## HTTP Request Lifecycle
1. Requests `routed` by Koa framework, specifically Koa-router component. Routes can be found in `src/routes.ts'
2. `classes/actions` plays a crucial role in the request handling. They handle JWT token extraction, authentication and request validation. In this example we validate only body schema, but in real life scenario, querystring and url params have to validated as well.
3. `services` handle HTTP requests and call underlying business logic units `classes`.
4. Response transformed to an API spec by `messages` module.
5. Messages either returned in a form of ClientError and ServerError, or in a specific JSON format

## Response format
* HTTP codes used to specify response type: 2xx - Success, 4xx - Client Error, 5xx Server Error
* In case of success there is a `data` object in the response
* In case of success there is an `error` object in the response 
* Returned lists consists of 2 primary objects: data - containing an array of result objects, and meta - containing a pagination information

##Test Output Example
```
❯ npm test

> brokerbay@1.0.0 test /Users/sergey/say/brokerbay
> npm run compile && mocha dist/test --exit --recursive --timeout 20000


> brokerbay@1.0.0 compile /Users/sergey/say/brokerbay
> tsc

BrokerBay API http server started at 0.0.0.0:8000


  Integration Test
    All endpoints should work as expected
      ✓ App should create users (50ms)
      ✓ App should authenticate users
ClientError: Only Agents can create listings
    at create (/Users/sergey/say/brokerbay/src/services/listings.ts:56:42)
    at /Users/sergey/say/brokerbay/src/classes/actions/UserAction.ts:37:22
    at Server.catchServerErrors (/Users/sergey/say/brokerbay/src/classes/Server.ts:88:13)
    at bodyParser (/Users/sergey/say/brokerbay/node_modules/koa-bodyparser/index.js:95:5) {
  json: {
    error: { message: 'Only Agents can create listings', details: undefined }
  },
  code: 400
}
      ✓ Should not create listings for admin
      ✓ App should create listings for agents (60ms)
      ✓ App should return listing counts
ClientError: You do not have permission to update this listing
    at update (/Users/sergey/say/brokerbay/src/services/listings.ts:89:32)
    at /Users/sergey/say/brokerbay/src/classes/actions/UserAction.ts:37:16
    at Server.catchServerErrors (/Users/sergey/say/brokerbay/src/classes/Server.ts:88:13)
    at bodyParser (/Users/sergey/say/brokerbay/node_modules/koa-bodyparser/index.js:95:5) {
  json: {
    error: {
      message: 'You do not have permission to update this listing',
      details: undefined
    }
  },
  code: 400
}
      ✓ App should perform authorization check and do an
      ✓ App should return list of listings
ClientError: Listing 1 not found
    at item (/Users/sergey/say/brokerbay/src/services/listings.ts:42:26)
    at /Users/sergey/say/brokerbay/src/classes/actions/AnonymousAction.ts:24:16
    at Server.catchServerErrors (/Users/sergey/say/brokerbay/src/classes/Server.ts:88:13)
    at bodyParser (/Users/sergey/say/brokerbay/node_modules/koa-bodyparser/index.js:95:5) {
  json: { error: { message: 'Listing 1 not found', details: undefined } },
  code: 404
}
      ✓ App should delete listings

  Service - Claims
    POST /users/sign-up
      ✓ Should create a user
    POST /users/sign-in
      ✓ Should authenticate a user


  10 passing (288ms)
```

## HTTP Requests Examples
Run application by `npm start`
```shell script
curl --location --request POST 'http://0.0.0.0:8000/users/sign-up' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Sergey",
    "lastName": "Y",
    "email": "hello@hello.com",
    "role": "ADMIN"
}'
```
```shell script
curl --location --request POST 'http://0.0.0.0:8000/users/sign-in' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userId": 1
}'
```
```shell script
curl --location --request GET 'http://0.0.0.0:8000/users/counts?limit=20'
```
