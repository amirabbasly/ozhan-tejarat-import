import React, { useState } from 'react';
import './TariffCalculator.css';

function TariffCalculator() {
  const [arzesheKol, setArzesheKol] = useState('');
  const [nerkheArz, setNerkheArz] = useState('');
  const [tarefe, setTarefe] = useState('');

  // تبدیل مقادیر ورودی از رشته به عدد
  const totalValue = parseFloat(arzesheKol) || 0;
  const exchangeRate = parseFloat(nerkheArz) || 0;
  const tariff = parseFloat(tarefe) || 1; // جهت پیش‌گیری از تقسیم بر صفر

  // محاسبات
  const arzesheRiali = totalValue * exchangeRate;   // ارزش ریالی
  const bime = arzesheRiali / 2000;                 // بیمه
  const cif = arzesheRiali + bime;                  // CIF
  const gomraki = cif / tariff;                     // گمرکی
  const mabnayeMaliat = cif + gomraki;              // مبنای مالیات
  const dahDarsad = mabnayeMaliat / 10;             // 10%
  const helalAhmar = gomraki / 100;                 // هلال احمر
  const pasmand = cif / 2000;                       // پسماند
  const varizi = gomraki + dahDarsad + helalAhmar + pasmand; // واریزی
  const maliat2Darsad = mabnayeMaliat / 50;         // (2% مالیات)
  const jameKol = varizi + maliat2Darsad;           // جمع کل
  const STD = arzesheRiali * 0.0008;           // جمع کل
  const VOC = arzesheRiali * 0.0007;           // جمع کل

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
          <input
            type="number"
            value={nerkheArz}
            onChange={(e) => setNerkheArz(e.target.value)}
            placeholder="نرخ ارز را وارد کنید"
            min={0}
          />
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
              <span>ارزش ریالی: </span>
              <strong>{arzesheRiali.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>بیمه: </span>
              <strong>{bime.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>CIF: </span>
              <strong>{cif.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>گمرکی: </span>
              <strong>{gomraki.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>مبنای مالیات: </span>
              <strong>{mabnayeMaliat.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>10%: </span>
              <strong>{dahDarsad.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>هلال احمر: </span>
              <strong>{helalAhmar.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>پسماند: </span>
              <strong>{pasmand.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>واریزی: </span>
              <strong>{varizi.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>(2% مالیات): </span>
              <strong>{maliat2Darsad.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box final-result">
              <span>جمع کل: </span>
              <strong>{jameKol.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>STD: </span>
              <strong>{STD.toFixed(2)}</strong>
            </div>
          </div>
          <div className="result-item">
            <div className="result-box">
              <span>VOC: </span>
              <strong>{VOC.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TariffCalculator;
