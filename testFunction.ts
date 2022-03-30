/**
 * Dependencies
 */

import postgres from 'postgres';
import { Client } from 'pg';
import AWS from 'aws-sdk';

/**
 * testFunction
 */

const createTestFunction = (usePostgresJS: boolean, useIAM: boolean) => {
  return async () => {
    const options: any = {
      user: process.env['DATABASE_USER'],
      host: process.env['DATABASE_HOST'],
      ssl: {
        rejectUnauthorized: false,
      },
    };

    if(useIAM) {
      const signer = new AWS.RDS.Signer({
        region: process.env['AWS_REGION'],
        hostname: process.env['DATABASE_HOST'],
        port: 5432,
        username: process.env['DATABASE_USER'],
      });

      const token = signer.getAuthToken({
        username: process.env['DATABASE_USER'],
      });

      options.password = token;
    } else {
      options.password = process.env['DATABASE_PASSWORD'];
    }

    if(usePostgresJS) {
      const sql = postgres(options);
      await sql`SELECT 1`; // Hangs here when useIAM=true
    } else {
      const client = new Client(options);
      await client.connect();
      client.query('SELECT 1');
    }
  };
}

const testWithPostgresJS = createTestFunction(true, false);
const testWithPG = createTestFunction(false, false);
const testWithPostgresJSAndIAM = createTestFunction(true, true);
const testWithPGAndIAM = createTestFunction(false, true);

export {
  testWithPostgresJS,
  testWithPG,
  testWithPostgresJSAndIAM,
  testWithPGAndIAM,
};
