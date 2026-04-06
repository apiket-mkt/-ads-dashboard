import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { parseRows } from '../utils/parseData';

const SHEET_ID = '1UmI0zdAUI7UJGrOHhA9x3wPZeBjBsuyeypYO3wQItnc';
const SHEET_NAME = 'DB';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

export const useSheetData = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        trimHeaders: true,
      });
      const parsed = parseRows(result.data);
      setRows(parsed);
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

  return { rows, loading, error, refetch: fetchData, lastUpdated };
};
