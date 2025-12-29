// app/api/download-job-data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import sql, { ConnectionPool, IResult, config as SQLConfig } from 'mssql';

const config: SQLConfig = {
  user: process.env.DB_USER || 'default_user',
  password: process.env.DB_PASSWORD || 'default_password',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'DB02',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'your_user',
      password: process.env.DB_PASSWORD || 'your_password',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 15000,
    requestTimeout: 30000,
  },
};


interface JobData {
  JobNo: string;
  CreateDateTime: Date;
  Month: string;
  From_: string;
  Destination_: string;
  PorterID: number;
  PorterName: string;
  AssignedDateTime: Date;
  AcceptDateTime: Date;
  CheckINDateTime: Date;
  StartDateTime: Date;
  CheckOUTDateTime: Date;
  FinishedDateTime: Date;
  Location_form: string;
  Location_dest: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { startDate, endDate } = await request.json();

  let pool: ConnectionPool | null = null;

  try {
    // สร้าง Connection Pool
    pool = new sql.ConnectionPool(config);
    await pool.connect();

    // Query ข้อมูล
    const result: IResult<JobData> = await pool
      .request()
    //   .input('startDate', sql.DateTime, new Date(startDate))
    //   .input('endDate', sql.DateTime, new Date(endDate + ' 23:59:59'))
        .input('startDate', sql.DateTime, new Date(startDate))
        .input('endDate', sql.DateTime, new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1))
        )  //ใช้ < nextDay แทน <= 23:59:59
      .query<JobData>(`
        SELECT DISTINCT  
          j.JobNo, 
          j.CreateDateTime, 
          FORMAT(j.CreateDateTime, 'MMM') AS Month,
          j.From_, 
          j.Destination_, 
          ja.PorterID, 
          p.PorterName,
          ja.AssignedDateTime, 
          ja.AcceptDateTime, 
          ja.CheckINDateTime,
          ja.StartDateTime, 
          ja.CheckOUTDateTime, 
          ja.FinishedDateTime,
          lr_from.LocationType AS Location_form, 
          lr_dest.LocationType AS Location_dest
        FROM [DB02].[dbo].[SMP_JobAssigned] ja  
        INNER JOIN [DB02].[dbo].[SMP_Jobs] j ON ja.JobNo = j.JobNo  
        LEFT JOIN [DB02].[dbo].[SMP_Porters] p ON ja.PorterID = p.PorterID   
        LEFT JOIN [DB02].[dbo].[SMP_LocationRequest] lr_from ON lr_from.Description = j.From_  
        LEFT JOIN [DB02].[dbo].[SMP_LocationRequest] lr_dest ON lr_dest.Description = j.Destination_  
        WHERE j.CreateDateTime >= @startDate
        AND j.CreateDateTime < @endDate
      `);
      
        //      WHERE j.CreateDateTime >= @startDate AND j.CreateDateTime <= @endDate
        // ORDER BY j.CreateDateTime ASC

    // สร้าง Excel Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Job Data');

    // กำหนด Columns
    worksheet.columns = [
      { header: 'Job No', key: 'JobNo', width: 12 },
      { header: 'Create Date', key: 'CreateDateTime', width: 15 },
      { header: 'Month', key: 'Month', width: 10 },
      { header: 'From', key: 'From_', width: 15 },
      { header: 'Destination', key: 'Destination_', width: 15 },
      { header: 'Porter ID', key: 'PorterID', width: 12 },
      { header: 'Porter Name', key: 'PorterName', width: 15 },
      { header: 'Assigned Date', key: 'AssignedDateTime', width: 15 },
      { header: 'Accept Date', key: 'AcceptDateTime', width: 15 },
      { header: 'Check IN', key: 'CheckINDateTime', width: 15 },
      { header: 'Start Date', key: 'StartDateTime', width: 15 },
      { header: 'Check OUT', key: 'CheckOUTDateTime', width: 15 },
      { header: 'Finished Date', key: 'FinishedDateTime', width: 15 },
      { header: 'Location From', key: 'Location_form', width: 15 },
      { header: 'Location Dest', key: 'Location_dest', width: 15 },
    ];

    // เพิ่มข้อมูลลงใน Excel
    worksheet.addRows(result.recordset);

    // ฟอร์แมต Header
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // ฟอร์แมต Date Columns
    const dateColumns = [2, 8, 9, 10, 11, 12, 13];
    dateColumns.forEach((colNum) => {
      for (let row = 2; row <= worksheet.rowCount; row++) {
        const cell = worksheet.getCell(row, colNum);
        cell.numFmt = 'yyyy-mm-dd hh:mm:ss';
      }
    });

    // สร้าง Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return Response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=JobData_${startDate}_to_${endDate}.xlsx`,
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unknown error occurred',
      },
      { status: 500 }
    );
  } finally {
    // ปิด Connection
    if (pool) {
      await pool.close();
    }
  }
}