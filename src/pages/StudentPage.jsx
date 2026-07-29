// ────────────────────────────────────────────────────────────────
// STUDENT PAGE
//
// S3.3 (15 pts) — Static markup with TailwindCSS, using SAMPLE_STUDENT:
//   • a student-id input + "Load" button (styled, with hover state)
//   • a student info card (name, email, phone)
//   • an enrollments table: course name, fee, enroll date,
//     status badge (ACTIVE = green, DROPPED = gray),
//     and a "Drop" button ONLY on ACTIVE rows
//
// S4.3 (10 pts) — Clicking "Load" fetches GET /students/<id> and shows
//   the real student + enrollments. For an unknown id, show the API's
//   error message (red box) instead of the card.
//
// S4.5 (10 pts) — Clicking "Drop" calls PUT /enrollments/<id>/drop,
//   then reloads the student so the status badge updates and the button
//   disappears.
// ────────────────────────────────────────────────────────────────
import { useState } from 'react';
import { BASE_URL } from '../api';

const SAMPLE_STUDENT = {
  id: 1,
  name: 'Sample Student',
  email: 'sample@example.com',
  phone: '012345678',
  enrollments: [
    {
      id: 1,
      status: 'ACTIVE',
      enrollDate: '2026-07-01',
      course: {
        name: 'Sample Course One',
        fee: 120,
      },
    },
    {
      id: 2,
      status: 'DROPPED',
      enrollDate: '2026-06-01',
      course: {
        name: 'Sample Course Two',
        fee: 200,
      },
    },
  ],
};

export default function StudentPage() {
  const [studentId, setStudentId] = useState('');
  const [student, setStudent] = useState(SAMPLE_STUDENT);
  const [error, setError] = useState('');
  async function loadStudent() {
    if (!studentId) return;

    try {
      setError('');

      const res = await fetch(`${BASE_URL}/students/${studentId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load student');
      }

      setStudent(data);
    } catch (err) {
      setStudent(null);
      setError(err.message);
    }
  }

  async function handleDrop(enrollmentId) {
    try {
      const res = await fetch(
        `${BASE_URL}/enrollments/${enrollmentId}/drop`,
        {
          method: 'PUT',
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to drop enrollment');
      }

      await loadStudent();
    } catch (err) {
      setError(err.message);
    }
  }
   return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Student lookup
      </h2>

      <div className="mb-6 flex gap-3">
        <input
          type="number"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Student ID"
          className="rounded border border-slate-300 px-3 py-2"
        />

        <button
          onClick={loadStudent}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Load
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      {student && (
        <>
          <div className="mb-6 rounded-lg bg-white p-5 shadow">
            <h3 className="mb-3 text-lg font-semibold">{student.name}</h3>

            <p>
              <strong>Email:</strong> {student.email}
            </p>

            <p>
              <strong>Phone:</strong> {student.phone || '-'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg bg-white shadow">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-4 py-3 text-left">Course</th>
                  <th className="px-4 py-3 text-left">Fee</th>
                  <th className="px-4 py-3 text-left">Enroll Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {student.enrollments.map((enrollment) => (
                  <tr
                    key={enrollment.id}
                    className="border-t border-slate-200"
                  >
                    <td className="px-4 py-3">
                      {enrollment.course.name}
                    </td>

                    <td className="px-4 py-3">
                      ${enrollment.course.fee}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(
                        enrollment.enrollDate
                      ).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          enrollment.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {enrollment.status === 'ACTIVE' && (
                        <button
                          onClick={() =>
                            handleDrop(enrollment.id)
                          }
                          className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                        >
                          Drop
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </div>
        </>
      )}
    </section>
  );
}