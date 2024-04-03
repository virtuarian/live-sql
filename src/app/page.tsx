// pages/index.js
'use client';
import React, { useState, useEffect } from 'react';
// import { Table } from 'react-bootstrap'; // or appropriate table component
import { Button, Stack, TablePagination, TextField, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { withStyles, makeStyles } from '@mui/styles';

import { TableVirtuoso, TableComponents } from 'react-virtuoso';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Loading from '@/components/Loading';

const useStyles = makeStyles({
  row: {
    maxHeight: '10px', // 適切な高さを指定してください
    height: '10px',
  },
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: '20px'
  }
}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  root: {
    height: '20px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#f1f1f1',
    padding: '3px',
  }
}))(TableCell);

const IndexPage = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [queryResult, setQueryResult] = useState<any>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [resultData, setResultData] = useState<any>([]);

  const [isRun, setRun] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const classes = useStyles();

  useEffect(() => {
    // console.log(queryResult);
    // setResultData(queryResult.result)
  }, [queryResult]);

  useEffect(() => {
    // console.log(resultData);
    // if (queryResult.length > 0) {
    //   const work = resultData.metaData.map((row:any, index:number) => ({ field: row.name, headerName: row.name, width: 150 }));
    //   setDynamicColumns(work);
    // }
  }, [resultData]);


  const fetchData = async () => {
    try {
      // console.log(`execute: ${sqlQuery}`);
      //初期化
      setPage(0);
      setErrorMsg('');
      setRun(true);
      setQueryResult([]);

      const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sqlQuery }),
      });

      const data = await response.json();

      //エラー発生時
      if (response.status === 500) {
        console.log(response);
        setErrorMsg(data.error);
        return;
      }

      console.log(data);

      // console.log(data);
      setQueryResult(data);

      // dynamicColumns =  data.result.metaData.map((row:any, index:number) => ({ field: row.name, headerName: row.name, width: 150 })) 
      // dynamicData =  await JSON.stringify(data.result.rows); 
    }
    catch (error:any) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
      console.error('Error executing SQL query:', error);
    }
    finally {
      setRun(false);

    }

  };



  return (
    <div>
      {/* <textarea value={sqlQuery}  /> */}


      <TextField
        id="outlined-multiline-static"
        label="Query"
        multiline
        rows={4}
        maxRows={10}
        style={{ width: "100%", backgroundColor: "white" }}
        variant="outlined"
        value={sqlQuery}
        onChange={(e) => setSqlQuery(e.target.value)}
      />
      <Button
        variant="contained"
        onClick={() => fetchData()}
        disabled={isRun}
      >Run</Button>

      <div>
        {errorMsg}
      </div>

      {queryResult.length !== 0 && (

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "#f7f7f7" }} stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow className={classes.row}>
                  {queryResult.result.metaData.map((row: any, index: number) => (
                    <TableCell style={{ textAlign: "center", padding: "5px", backgroundColor: "#f8f8f8", borderWidth: "1px", borderStyle: "solid", borderColor: "#f1f1f1" }}>{row.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? queryResult.result.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : queryResult.result.rows
                ).map((row: any, index: number) => (
                  // {queryResult.result.rows.map((row:any, index:number) => (
                  <StyledTableRow className={classes.row}>
                    {row.map((data: any, b: any) =>
                      <StyledTableCell>{data}</StyledTableCell>
                    )}
                  </StyledTableRow>
                ))
                }
              </TableBody>
            </Table>

          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={queryResult.result.rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />

        </Paper>

      )}

      {isRun && <Loading />}

    </div>
  );
};

export default IndexPage;
