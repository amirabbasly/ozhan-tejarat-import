import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axiosInstance from '../utils/axiosInstance'; // Import your axios instance
import './TariffCalculator.css';

function TariffCalculator() {
  const [arzesheKol, setArzesheKol] = useState('');
  const [nerkheArz, setNerkheArz] = useState('');
  const [tarefe, setTarefe] = useState('');
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customCurrency, setCustomCurrency] = useState(false); // Track if user wants to enter custom value

  useEffect(() => {
    setLoading(true);
    axiosInstance.get('/customs/currency-exchange-rates/')
      .then(response => {
        const formattedData = response.data.map(item => {
          // Clean the value by removing unwanted characters (e.g., '[')
          const cleanedValue = item.value.replace(/[^\d.-]/g, '');  // Keep only digits, period, and dash
          
          return {
            label: `${item.label} - ${cleanedValue}`, // Combine label and cleaned value for display
            value: cleanedValue, // Only store the cleaned value
          };
        });
        setCurrencyOptions(formattedData);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch currency data');
        setLoading(false);
        console.error('Error fetching currency data:', error);
      });
  }, []);

  // Convert input values from string to number
  const totalValue = parseFloat(arzesheKol) || 0;
  const exchangeRate = customCurrency ? parseFloat(nerkheArz) : parseFloat(nerkheArz) || 0; // Use custom value if selected
  const tariff = parseFloat(tarefe) || 1; // To avoid division by zero

  // Calculations
  const arzesheRiali = totalValue * exchangeRate;   // Value in Rial
  const bime = arzesheRiali / 2000;                 // Insurance
  const cif = arzesheRiali + bime;                  // CIF
  const gomraki = cif / tariff;                     // Customs duty
  const mabnayeMaliat = cif + gomraki;              // Tax base
  const dahDarsad = mabnayeMaliat / 10;             // 10%
  const helalAhmar = gomraki / 100;                 // Red Crescent
  const pasmand = cif / 2000;                       // Waste
  const varizi = gomraki + dahDarsad + helalAhmar + pasmand; // Total payment
  const maliat2Darsad = mabnayeMaliat / 50;         // (2% tax)
  const jameKol = varizi + maliat2Darsad;           // Total sum
  const STD = arzesheRiali * 0.0008;                // STD calculation
  const VOC = arzesheRiali * 0.0007;                // VOC calculation

  const handleCurrencyChange = (selectedOption) => {
    setNerkheArz(selectedOption ? selectedOption.value : '');
  };

  return (
    <div className="calc-container">
      <div className="calculator">
        <h2>محاسبه هزینه‌های گمرکی</h2>

        <div className="input-container">
          <label>ارزش کل:</label>
          <input
            type="number"
            value={arzesheKol}
            onChange={(e) => setArzesheKol(e.target.value)}
            placeholder="ارزش کل را وارد کنید"
            min={0}
          />
        </div>

        <div className="input-container">
          <label>نرخ ارز:</label>
          <div className="currency-toggle">
            <label>
              <input
                type="checkbox"
                checked={customCurrency}
                onChange={() => setCustomCurrency(!customCurrency)}
              />
              وارد کردن نرخ ارز دستی
            </label>
          </div>

          {customCurrency ? (
            <input
              type="number"
              value={nerkheArz}
              onChange={(e) => setNerkheArz(e.target.value)}
              placeholder="نرخ ارز را وارد کنید"
              min={0}
            />
          ) : (
            loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Select
                options={currencyOptions}
                onChange={handleCurrencyChange}
                placeholder="نرخ ارز را انتخاب کنید"
                value={currencyOptions.find(option => option.value === nerkheArz)}
              />
            )
          )}
        </div>

        <div className="input-container">
          <label>تعرفه:</label>
          <input
            type="number"
            value={tarefe}
            onChange={(e) => setTarefe(e.target.value)}
            placeholder="تعرفه را وارد کنید"
            min={0}
          />
        </div>

        <div className="results">
          <h3>نتایج محاسبات</h3>
          <div className="result-item">
            <div className="result-box">
              <span>ارزش ریالی:</span>
              <strong>{arzesheRiali.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>بیمه: </span>
              <strong>{bime.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>CIF: </span>
              <strong>{cif.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>گمرکی: </span>
              <strong>{gomraki.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>مبنای مالیات: </span>
              <strong>{mabnayeMaliat.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>10%: </span>
              <strong>{dahDarsad.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>هلال احمر: </span>
              <strong>{helalAhmar.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>پسماند: </span>
              <strong>{pasmand.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>واریزی: </span>
              <strong>{varizi.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>(2% مالیات): </span>
              <strong>{maliat2Darsad.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box final-result">
              <span>جمع کل: </span>
              <strong>{jameKol.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>STD: </span>
              <strong>{STD.toFixed(0)} ریال</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>VOC: </span>
              <strong>{VOC.toFixed(0)} ریال</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TariffCalculator;
