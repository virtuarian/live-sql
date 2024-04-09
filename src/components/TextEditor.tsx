'use client';
import React, { useEffect, useRef, useState } from "react";
// import 'monaco-sql-languages/esm/languages/mysql/mysql.contribution';
// import 'monaco-sql-languages/esm/languages/flink/flink.contribution';
// import 'monaco-sql-languages/esm/languages/spark/spark.contribution';
// import 'monaco-sql-languages/esm/languages/hive/hive.contribution';
// import 'monaco-sql-languages/esm/languages/trino/trino.contribution';
// import 'monaco-sql-languages/esm/languages/pgsql/pgsql.contribution';
// import 'monaco-sql-languages/esm/languages/impala/impala.contribution';
// import { MySQL, FlinkSQL, SparkSQL, HiveSQL, PostgreSQL, TrinoSQL, ImpalaSQL } from 'dt-sql-parser';

// import { editor } from 'monaco-editor';
// import * as monaco from 'monaco-editor';
//import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "@monaco-editor/react";

interface EditorProps {
  onChange: (value: string | undefined) => void;
}

const TextEditor: React.FC<EditorProps> = ({ onChange }) => {


  // return <div id="editor" style={{ height: "500px" }} />;

  return  <MonacoEditor
      width="800"
      height="100%"
      defaultLanguage="sql"
      className="border"
      theme=""
      defaultValue="select * from user_tables"
      options={{
        selectOnLineNumbers: true,
        fontSize: 18,
        minimap: { enabled: false },
      }}
      onChange={onChange}
    />
};

export default TextEditor;
