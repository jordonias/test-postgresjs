/**
 * Dependencies
 */

import { Construct } from 'constructs';
import { Environment, Stack } from 'aws-cdk-lib';
import { BastionHostLinux, InstanceClass, InstanceType, InstanceSize, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import path from 'path';

import { Database } from './database';

/**
 * InfrastructureStack
 */

export class InfrastructureStack extends Stack {
  public constructor(scope: Construct, id: string, env: Environment) {
    super(scope, id, { env });

    const vpc = new Vpc(this, 'TestVPC', {
      maxAzs: 2,
    });

    const database = new Database(this, 'TestDatabase', {
      vpc,
    });

    const createTestFunction = (functionName: string) => {
      const func = new LambdaFunction(this, `${functionName}Function`, {
        code: Code.fromAsset(path.join(__dirname, '../dist')),
        functionName: functionName,
        handler: `testFunction.${functionName}`,
        memorySize: 1024,
        runtime: Runtime.NODEJS_14_X,
        vpc,
        environment: {
          DATABASE_HOST: database.proxy.endpoint,
          DATABASE_USER: database.credentials.username.toString(),
          DATABASE_PASSWORD: database.credentials.password.toString(),
        },
      });

      database.proxy.grantConnect(func);
      return func;
    };

    const securityGroup = new SecurityGroup(this, 'TestEC2SecurityGroup', {
      vpc: vpc,
    });

    const bastion = new BastionHostLinux(this, 'TestBastion', {
      vpc,
      securityGroup,
      subnetSelection: {
        subnetGroupName: 'Public',
      },
      instanceType: InstanceType.of(
        InstanceClass.T3,
        InstanceSize.MICRO,
      ),
    });
    bastion.connections.allowFromAnyIpv4(Port.tcp(22));
    bastion.connections.allowFromAnyIpv4(Port.tcp(1111));

    database.securityGroup.addIngressRule(securityGroup, Port.tcp(5432), 'Allow access from EC2', true);

    createTestFunction('testWithPostgresJS');
    createTestFunction('testWithPG');
    createTestFunction('testWithPostgresJSAndIAM');
    createTestFunction('testWithPGAndIAM');
  }
}
