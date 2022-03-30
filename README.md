This will set up test infrastructure to test the issue at: https://github.com/porsager/postgres/issues/288

Install dependencies
```
npm install
```

Configure AWS
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
