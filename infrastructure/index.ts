/**
 * Dependencies
 */

import { App } from 'aws-cdk-lib';
import { InfrastructureStack } from './stack';

/**
 * App
 */

const app = new App();
new InfrastructureStack(app, 'TestStack', {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
});
