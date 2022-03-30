This will set up test infrastructure to test the issue at: https://github.com/porsager/postgres/issues/288

Install dependencies
```
npm install
```

Configure AWS
See: https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html
```
aws configure
```

Bootstrap CDK
```
// With your accountID, you can optain this with `aws sts get-caller-identity`
ACCOUNT_ID=<YOUR_ACCOUNT_ID> npm run bootstrap
```

Deploy the infrastructure:
```
npm run build
npm run deploy
```

After testing you should destroy the stack to avoid any charges to AWS
```
npm run destroy
```

Message me, post in the issue, or email jordan@jordonias.com with any questions

To test the functions, got to Lambda in the AWS Console and run tests on the functions.

There will be 4 functions:
(The event JSON for all functions can be an empty object)

* testWithPG - Works fine (Need to diable iam auth in the rds proxy to be able to test this function)
* testWithPostgresJS - Works fine (Need to diable iam auth in the rds proxy to be able to test this function)
* testWithPGAndIAM - Works fine
* testWithPostgresJSAndIAM - Hangs and eventually times out

If you want to test the non-iam functions you will need to disable IAM authentication in RDS proxy by clicking Actions -> Modify here: https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#modify-proxy:id=testproxy


