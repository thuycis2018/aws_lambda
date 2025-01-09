# REST APIs

Using AWS API Gateway, Lambda (Node.js), and RDS (PostgreSQL).

## AWS API Gateway

- Set up AWS API Gateway resource and routes (GET, POST, GET/{id}, PUT/{id}, DELETE/{id})
- Add Lambda function in each integration for each route
- Set up authorization

## AWS Lambda

- Set up 'pg' dependency to connect to PostgreSQL
- Set up index.mjs and related files.
- Set up environment variables.
- Set up correct VPC, subnets and security group to allow API Gateway to trigger Lambda function(s).
