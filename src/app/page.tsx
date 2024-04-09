// pages/index.js
'use client';
import React, { useState, useEffect } from 'react';
// import { Table } from 'react-bootstrap'; // or appropriate table component
import { Box, Button, IconButton, Stack, TablePagination, TextField, Typography } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { withStyles, makeStyles } from '@mui/styles';
import Loading from '@/components/Loading';
import TextEditor from '@/components/TextEditor';
// import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import {
  VerticalResizeHandle,
} from 'react-resize-separator';
import 'react-resize-separator/dist/css/index.css';

const useStyles = makeStyles({
  row: {
    maxHeight: '10px', // 適切な高さを指定してください
    height: '10px',
    padding: '3px',
  },
  root: {
    padding: '3px',
  }
});

const StyledTableRow = withStyles((theme) => ({
  root: {
    height: '10px',
    padding: '3px',
  },

}))(TableRow);

const StyledTableCell = withStyles((theme) => ({
  root: {
    height: '10px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#f1f1f1',
    padding: '2px',
  },
}))(TableCell);

const IndexPage = () => {
  const [sqlQuery, setSqlQuery] = useState('select * from user_tables');
  const [queryResult, setQueryResult] = useState<any>([]);
  const [updateResult, setUpdateResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>('');
  // const [resultData, setResultData] = useState<any>([]);

  const [isRun, setRun] = useState<boolean>(false);
  // const [hRow, setHRow] = React.useState<number>(100);

  const [text, setText] = useState<string>("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tableHeight,setTableHeight] = useState<number>(300);

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
    console.log(text);
  }, [text]);



  const fetchData = async (sql:string) => {
    try {
      // console.log(`execute: ${sqlQuery}`);

      //初期化
      setPage(0);
      setErrorMsg('');
      setRun(true);
      setQueryResult([]);
      setUpdateResult("");

      let runSql = sql.split(";");

      const response = await fetch('/api/execute-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({sqlQuery:runSql[0]}),
      });

      const data = await response.json();

      //エラー発生時
      if (response.status === 500) {
        // console.log(response);
        setErrorMsg(data.error);
        return;
      }

      console.log(data);


      //SELECT文の場合
      if ("metaData" in data.result) {
        // console.log(data);
        setQueryResult(data);
      }
      else {
        setUpdateResult("正常に実行しました");

      }

      // console.log(data);


      // dynamicColumns =  data.result.metaData.map((row:any, index:number) => ({ field: row.name, headerName: row.name, width: 150 })) 
      // dynamicData =  await JSON.stringify(data.result.rows); 
    }
    catch (error:any) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      }
      console.error('Error executing SQL query:', error);
      return;
    }
    finally {
      setRun(false);

    }

  };



  return (
    <div>

    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="static">
        <Toolbar >
          {/* <IconButton 
           size="large"
           edge="start"
           color="inherit"
           aria-label="menu"
            sx={{mr:2}}>
              <MenuIcon/>
          </IconButton> */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          </Typography>
          <Button
            // variant="contained"
            style={{height:"50px",  textAlign:"right"}} 
            color="inherit"
            onClick={() => fetchData(sqlQuery)}
            disabled={isRun}
          >Run</Button>
        </Toolbar>
      </AppBar>
      </Box>



      <div
        className="d-flex"
        style={{ flexDirection: 'column', alignItems: 'center' }}
      >

        <div id="editor"        
          className="flex-only-basis-auto"
          style={{height:"200px" }}
        >
          <TextEditor onChange={(value:any)=>setSqlQuery(value)}></TextEditor>


        </div>
 
        {/* <TextField
          id="outlined-multiline-static"
          label="Query"
          multiline
          rows={4}
          maxRows={10}
          style={{ width: "100%", backgroundColor: "white" }}
          variant="outlined"
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
        /> */}

        {/* <div style={{ color: "red", margin:"10px" }} > */}
        

        <VerticalResizeHandle
          id="vblock-separator"
          className="resize-separator-horizontal flex-only-basis-auto"
          // onMouseResize={(e,element,newPxHeight)=>console.log(newPxHeight)}
        />

        <div className="" style={{ flex: 'auto'}}>

          <div className="text-color-red-100">{errorMsg}</div>
          <div style={{ color: "black", margin:"10px" }}>{updateResult}</div>

          {queryResult.length !== 0 && (

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer style={{height:"300px"}}>
                <Table  style={{borderWidth: "1px", borderStyle: "solid", borderColor: "#f7f7f7" }} stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow className={classes.row}>
                      {queryResult.result.metaData.map((row: any, index: number) => (
                        <TableCell key={index} style={{ textAlign: "center", padding: "5px", backgroundColor: "#f8f8f8", borderWidth: "1px", borderStyle: "solid", borderColor: "#f1f1f1" }}>{row.name}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(rowsPerPage > 0
                      ? queryResult.result.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : queryResult.result.rows
                    ).map((row: any, index: number) => (
                      // {queryResult.result.rows.map((row:any, index:number) => (
                      <StyledTableRow key={index}  className={classes.row}>
                        {row.map((data: any, index2: any) =>
                          <StyledTableCell key={index2} style={{padding:"2px"}}>{data}</StyledTableCell>
                        )}
                      </StyledTableRow>
                    ))
                    }
                  </TableBody>
                </Table>

              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 100]}
                component="div"
                count={queryResult.result.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

            </Paper>

          )}
        </div>
      </div>
      {isRun && <Loading />}

    </div>
  );
};

export default IndexPage;
