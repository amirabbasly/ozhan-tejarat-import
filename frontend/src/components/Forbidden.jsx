// src/components/Forbidden.js

import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Forbidden</h1>
      <p>شما اجازه دسترسی به این صفحه را ندارید.</p>
      <Link to="/">بازگشت به صفحه اصلی</Link>
    </div>
  );
};

export default Forbidden;
