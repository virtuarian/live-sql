// pages/api/upload.js

import oracledb from 'oracledb';
import { NextRequest, NextResponse } from 'next/server';
// import { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../../lib/db'


export const config = {
  api: {
    bodyParser: false,
  },
};


// wget https://download.oracle.com/otn_software/linux/instantclient/1912000/instantclient-basic-linux.x64-19.12.0.0.0dbru.zip
// wget https://download.oracle.com/otn_software/linux/instantclient/1912000/instantclient-sqlplus-linux.x64-19.12.0.0.0dbru.zip
// sudo mkdir -p /opt/oracle
// cd /opt/oracle/
// sudo unzip ~/oracleclient/instantclient-basic-linux.x64-19.12.0.0.0dbru.zip
// sudo unzip ~/oracleclient/instantclient-sqlplus-linux.x64-19.12.0.0.0dbru.zip
// export PATH=/opt/oracle/instantclient_19_12:$PATH
// export LD_LIBRARY_PATH=/opt/oracle/instantclient_19_12:$LD_LIBRARY_PATH

//export async function POST(req: NextRequest) {
export async function POST(req: NextRequest, res:NextResponse) {

  let connection;

  try {
    // Oracleデータベースへの接続設定
    // await oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_19_12' }); //process.env.ORACLE_LIB_DIR

    // const connection = await oracledb.getConnection({
    //   user: 'study',//process.env.ORACLE_USER,
    //   password: 'PassB3at98AKword',//process.env.ORACLE_PASSWORD,
    //   connectString: '10.160.135.134:1521/ORCLPDB1',//rocess.env.ORACLE_CONNECTION_STRING,
    // });

    connection = await (await pool).getConnection();

    const body = await req.json() ;
    const { sqlQuery } = body;

    // 実行するSQLクエリ
    // let body = await req.body; // クライアントから送信されたSQLクエリ
    // const { sqlQuery } = req.body;
    // console.log(req.body);
    // console.log("-------------");
    // console.log("Query:");
    // console.log(sqlQuery);
    // console.log("-------------");

    // const sqlQuery = await body.sqlQuery;

    const result = await connection.execute(sqlQuery);

    // 結果をJSON形式で返す
    // res.status(200).json(result.rows);
    return NextResponse.json({ result:  result }, {status: 200});

  } catch (error:any) {
    if (error instanceof Error) { 
      // console.error('Error executing Oracle SQL query:', error);
      // res.status(500).json({ error: 'Error executing SQL query' });
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error closing connection:', error);
      }
    }
  }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     await executeSQL(req, res);
//   } else {
//     res.status(405).json({ error: 'Method Not Allowed' });
//   }
// }