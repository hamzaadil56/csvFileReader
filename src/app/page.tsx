"use client";
import React, { useState } from "react";
import { parse } from "papaparse";
import Papa, { ParseResult } from "papaparse";

type Data = {
  email: string;
};

function CSVUploader() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCSVData] = useState<Data[]>([]);
  const [uploadStatus, setUploadStatus] = useState(false);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setSelectedFile(event.target.files![0]);
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target!.result! as string;
        const parsedData = Papa.parse(csvText, { header: true })
          .data as Array<Data>;
        setCSVData(parsedData);
        sendDataToBackend(parsedData);
      };
      reader.readAsText(selectedFile);
    } else {
      console.log("No file selected!");
    }
  };

  const sendDataToBackend = async (data: Data[]) => {
    try {
      const res = await fetch("/api/csvFileReader", {
        body: JSON.stringify(data),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData: any = await res.json();
      if (resData.emails !== "Successful") {
        throw new Error(resData.error);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleFileUpload}>Upload</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {csvData.length > 0 && <table>{/* Table rendering code */}</table>}
    </div>
  );
}

export default CSVUploader;
