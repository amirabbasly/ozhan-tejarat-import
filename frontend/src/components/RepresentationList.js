import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchRepresentations,
  deleteRepresentation
} from '../actions/representationActions';
import './RepresentationList.css';

const RepresentationList = () => {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { representations = [], loading, error } =
    useSelector((state) => state.representations);

  useEffect(() => {
    dispatch(fetchRepresentations());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this representation?')) {
      dispatch(deleteRepresentation(id));
    }
  };

  const handleEditClick = (id) => {
    navigate(`/representations/${id}/edit`);
  };

  if (loading) return <div>Loading…</div>;
  if (error)   return <div>Error: {error}</div>;

  return (
    <div className="representation-list">
      <h2>لیست وکالت‌نامه‌ها</h2>

      <table>
        <thead>
          <tr>
            <th>وکیل</th>
            <th>موکل</th>
            <th>درخواست‌دهنده</th>
            <th>تاریخ شروع</th>
            <th>تاریخ پایان</th>
            <th>توکل به غیر</th>
            <th>عزل وکیل</th>
            <th>خلاصه وکالت</th>
            <th>فایل</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {representations.map((rep) => (
            <tr key={rep.id}>
              <td>{rep.principal?.full_name ?? '-'}</td>
              <td>{rep.attorney?.full_name ?? '-'}</td>
              <td>{rep.applicant_info?.full_name ?? '-'}</td>
              <td>{rep.start_date ?? '-'}</td>
              <td>{rep.end_date ?? '-'}</td>
              <td>{rep.another_deligation ? 'بله' : 'خیر'}</td>
              <td>{rep.representor_dismissal ? 'بله' : 'خیر'}</td>
              <td>{rep.representation_summary ?? '-'}</td>
              <td>
                {rep.file ? (
                  <a href={rep.file} target="_blank" rel="noopener noreferrer">
                    View&nbsp;File
                  </a>
                ) : (
                  'No File'
                )}
              </td>
              <td>
                <button onClick={() => handleEditClick(rep.id)}>ویرایش</button>
                <button onClick={() => handleDelete(rep.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepresentationList;