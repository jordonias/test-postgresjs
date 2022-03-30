/**
 * Dependencies
 */

import { Construct } from 'constructs';
import {
  Credentials,
  DatabaseInstance,
  DatabaseInstanceEngine,
  DatabaseProxy,
  DatabaseSecret,
  PostgresEngineVersion,
  ProxyTarget,
  StorageType,
} from 'aws-cdk-lib/aws-rds';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  InterfaceVpcEndpoint,
  InterfaceVpcEndpointAwsService,
  Peer,
  Port,
  SecurityGroup,
  Vpc
} from 'aws-cdk-lib/aws-ec2';

/**
 * Types
 */

interface Props {
  vpc: Vpc,
}

/**
 * Database
 */

export class Database extends Construct {
  public proxy: DatabaseProxy;
  public credentials: Credentials;

  public constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    const secret = new DatabaseSecret(this, 'TestSecret', {
      username: 'test',
    });
    this.credentials = Credentials.fromSecret(secret, 'test');

    new InterfaceVpcEndpoint(this, 'TestSecretsManagerEndpoint', {
      vpc: props.vpc,
      service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });

    const securityGroup = new SecurityGroup(this, 'TestDBSecurityGroup', {
      vpc: props.vpc,
    });
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(5432));

    const instance = new DatabaseInstance(this, 'TestDBInstance', {
      engine: DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_12_9,
      }),
      instanceType: InstanceType.of(
        InstanceClass.T3,
        InstanceSize.MICRO,
      ),
      vpc: props.vpc,
      allocatedStorage: 20,
      storageType: StorageType.GP2,
      deletionProtection: false,
      databaseName: 'test',
      port: 5432,
      credentials: this.credentials,
      securityGroups: [
        securityGroup,
      ]
    });

    const proxy = new DatabaseProxy(this, 'TestProxy', {
      proxyTarget: ProxyTarget.fromInstance(instance),
      secrets: [ instance.secret ],
      // You can uncomment this to test without iam auth, but it is probably more easy to make this change in the AWS console
      // https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1#modify-proxy:id=testproxy
      iamAuth: true,
      vpc: props.vpc,
      securityGroups: [
        securityGroup,
      ],
    });

    this.proxy = proxy;
  }
}
