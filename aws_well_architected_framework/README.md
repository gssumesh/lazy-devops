## Generate Well Architected Framework Questionaire

- Login to AWS account
- Navigate to AWS well architectedworkload
- Create a new workload to initiate the review
- Add a `.env` file with following configuration
```
WORKLOAD_ID=<Workload Id like alphanumeric typically suffix of arn>
AWS_REGION=<AWS region like us-west-2 etc.>
```
- Load AWS configuration in terminal
- Run `npm install`
- Run `node index.js`