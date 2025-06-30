import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

/**
 * DatabaseConfig component allows users to input database connection details and connect to the backend API.
 *
 * Props:
 *   onConnected: function(success: boolean) => void
 */
const DatabaseConfig = ({ onConnected }) => {
  // State for form fields
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(5432);
  const [dbName, setDbName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  // Handle form submission
  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);
    try {
      const response = await axios.post('http://localhost:8082/api/connect', {
        host,
        port: Number(port),
        dbName,
        username,
        password,
      });
      setMessage(response.data?.message || 'Connected successfully!');
      setIsError(false);
      if (onConnected) onConnected(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message || error.message || 'Connection failed.'
      );
      setIsError(true);
      if (onConnected) onConnected(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dbconfig-container">
      <h2 className="dbconfig-title">Database Connection</h2>
      <form onSubmit={handleConnect} className="dbconfig-form">
        <div className="dbconfig-field">
          <label className="dbconfig-label" htmlFor="host">Host</label>
          <input
            id="host"
            type="text"
            className="dbconfig-input"
            value={host}
            onChange={(e) => setHost(e.target.value)}
            required
          />
        </div>
        <div className="dbconfig-field">
          <label className="dbconfig-label" htmlFor="port">Port</label>
          <input
            id="port"
            type="number"
            className="dbconfig-input"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            required
            min="1"
            max="65535"
          />
        </div>
        <div className="dbconfig-field">
          <label className="dbconfig-label" htmlFor="dbName">Database Name</label>
          <input
            id="dbName"
            type="text"
            className="dbconfig-input"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
            required
          />
        </div>
        <div className="dbconfig-field">
          <label className="dbconfig-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            className="dbconfig-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="dbconfig-field">
          <label className="dbconfig-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="dbconfig-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          className="dbconfig-btn"
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect'}
        </button>
      </form>
      {message && (
        <div
          className={`dbconfig-message ${isError ? 'dbconfig-error' : 'dbconfig-success'}`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

DatabaseConfig.propTypes = {
  onConnected: PropTypes.func,
};

export default DatabaseConfig; 