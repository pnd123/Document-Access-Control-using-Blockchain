import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error("Error fetching logs:", err));
  }, []);

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2 style={styles.title}>📜 Activity Log</h2>
        {logs.length === 0 ? (
          <p style={styles.message}>No logs found.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.trHeader}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Filename</th>
                <th style={styles.th}>CID</th>
                <th style={styles.th}>Uploader</th>
                <th style={styles.th}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} style={styles.tr}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{log.filename}</td>
                  <td style={styles.td}>
                    <span style={styles.cid}>{log.cid.slice(0, 10)}...</span>
                  </td>
                  <td style={styles.td}>{log.uploader}</td>
                  <td style={styles.td}>{new Date(log.timestamp * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    zIndex: 9999,
  },
  popup: {
    backgroundColor: '#121212',
    color: '#E2E2E2',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '90%',
    maxWidth: '1000px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 5px 30px rgba(0,0,0,0.5)',
    border: '1px solid #4fafff',
  },
  title: {
    marginBottom: '1rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    borderBottom: '2px solid #4fafff',
    paddingBottom: '0.5rem',
    textAlign: 'center',
    letterSpacing: '1px',
  },
  message: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#888',
    fontSize: '1.1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    fontSize: '1rem',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid #4fafff',
    color: '#E2E2E2',
    fontWeight: '600',
  },
  trHeader: {
    backgroundColor: '#262626',
  },
  tr: {
    borderTop: '1px solid #333',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #333',
    color: '#D1D1D1',
    fontWeight: '500',
  },
  cid: {
    color: 'transparent',
    transition: 'color 0.3s ease-in-out',
    cursor: 'pointer',
  },
  cidHover: {
    color: '#4fafff',
  }
};

export default ActivityLog;
