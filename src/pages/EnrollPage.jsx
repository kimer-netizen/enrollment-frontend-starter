// ────────────────────────────────────────────────────────────────
// ENROLL PAGE
//
// S3.2 (15 pts) — Static form markup with TailwindCSS:
//   • labeled student-id input (number)
//   • labeled course <select> (use the two SAMPLE_COURSES as options
//     for now)
//   • a submit button with a hover state
//   • a green success box and a red error box (hardcode both visible
//     for S3.2 — you will show/hide them in S4.4)
//
// S4.4 (15 pts) — Make it dynamic:
//   • fill the select with real courses from GET /courses (name + fee +
//     how many seats left)
//   • on submit: POST /enrollments with { studentId, courseId } (numbers!)
//   • success → show a success message in the green box, clear the form
//   • failure (404 / 409) → show the API's error message in the red box
//   • only one of the two boxes is visible at a time
// ────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { BASE_URL } from '../api';

export default function EnrollPage() {
  // S4.4 — list of courses for the dropdown
  const [courses, setCourses] = useState([]);
  // S3.2 — what the user typed/picked
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  // S3.2 / S4.4 — success and error messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // S4.4 — get the courses when the page loads
  useEffect(() => {
    fetch(`${BASE_URL}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data));
  }, []);

  // S4.4 — runs when the form is submitted
  async function onSubmit(e) {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    // send the enrollment to the API
    const res = await fetch(`${BASE_URL}/enrollments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: Number(studentId),
        courseId: Number(courseId),
      }),
    });
    const data = await res.json();

    // it failed: show the error message
    if (!res.ok) {
      setErrorMsg(data.error);
      return;
    }

    // it worked: show success and reset the form
    setSuccessMsg('Student enrolled!');
    setStudentId('');
    setCourseId('');
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">Enroll a student</h2>

      {/* S3.2 — the form: student id, course dropdown, submit button */}
      <form onSubmit={onSubmit} className="max-w-sm space-y-3 p-5 border border-slate-200 rounded-lg bg-white shadow-sm">
        <div>
          <label className="block mb-1 text-sm text-slate-700">Student ID</label>
          <input
            type="number"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm text-slate-700">Course</label>
          {/* S4.4 — dropdown options come from the real courses list */}
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="">— choose a course —</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name} (${course.fee}, {course.seatsAvailable} left)
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="px-4 py-2 bg-teal-800 text-white rounded hover:bg-teal-900">
          Enroll
        </button>
      </form>

      {/* S3.2 / S4.4 — green success box */}
      {successMsg && (
        <div className="mt-4 max-w-sm px-3 py-2 rounded bg-green-100 border border-green-400 text-green-800">
          {successMsg}
        </div>
      )}

      {/* S3.2 / S4.4 — red error box */}
      {errorMsg && (
        <div className="mt-4 max-w-sm px-3 py-2 rounded bg-red-100 border border-red-400 text-red-800">
          {errorMsg}
        </div>
      )}
    </section>
  );
}