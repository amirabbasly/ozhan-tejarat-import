import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

function ExcelInvoice() {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        '/documents/fill_inv/',
        { 
          name, 
          date, 
          amount 
        },
        {
          responseType: 'blob', // so we receive the file as a blob
        }
      );

      // Create a temporary blob URL
      const blobUrl = URL.createObjectURL(response.data);

      // Create a link and click it programmatically
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', 'filled_template.xlsx');
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  return (
    <div>
      <h2>Fill Excel Template</h2>
      <form onSubmit={handleDownload}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Date:</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Amount:</label>
          <input 
            type="number" 
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit">Download Excel</button>
      </form>
    </div>
  );
}

export default ExcelInvoice;
