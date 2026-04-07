import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { parseRows, parseConversionRows } from '../utils/parseData';

const SHEET_ID = '1UmI0zdAUI7UJGrOHhA9x3wPZeBjBsuyeypYO3wQItnc';
const makeUrl = (sheet) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;

const fetchSheet = async (sheetName, parser) => {
  const res = await fetch(makeUrl(sheetName));
  if (!res.ok) throw new Error(`HTTP ${res.status} (${sheetName} 시트)`);
  const text = await res.text();
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    trimHeaders: true,
  });
  return parser(result.data);
};

export const useSheetData = () => {
  const [rows, setRows] = useState([]);
  const [convRows, setConvRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dbRows, conversionRows] = await Promise.all([
        fetchSheet('DB', parseRows),
        fetchSheet('전환', parseConversionRows),
      ]);
      setRows(dbRows);
      setConvRows(conversionRows);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { rows, convRows, loading, error, refetch: fetchData, lastUpdated };
};
