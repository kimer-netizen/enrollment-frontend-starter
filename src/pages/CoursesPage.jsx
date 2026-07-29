// ────────────────────────────────────────────────────────────────
// COURSES PAGE
//
// S3.1 (15 pts) — Static markup with TailwindCSS, using SAMPLE_COURSES:
//   • a search input styled with Tailwind (full width, border, focus state)
//   • a table: styled header row, borders or zebra rows, one row per
//     course with id, name, fee (show it as "$120"), and a seats badge
//   • badge shows "available / total" — green when seatsAvailable > 0,
//     red when it is 0
//
// S4.1 (10 pts) — Load the real courses from GET /courses when the page
//   mounts (useEffect + fetch). Show "Loading..." while the request runs.
//   Replace SAMPLE_COURSES with the fetched data.
//
// S4.2 (10 pts) — Make the search input work: typing refetches with
//   GET /courses?search=<text> so the table only shows matching names.
// ────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';
import { BASE_URL } from '../api';

// Use this sample data to build the static markup for S3.1.
// In S4.1 you will replace it with data from the API.
const SAMPLE_COURSES = [
  { id: 1, name: 'Sample Course One', fee: 120, seatsTotal: 20, seatsAvailable: 18 },
  { id: 2, name: 'Sample Course Two', fee: 200, seatsTotal: 10, seatsAvailable: 0 },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // S4.1 + S4.2 — Fetch courses
  const fetchCourses = (searchText = '') => {
    setLoading(true);

    fetch(`${BASE_URL}/courses?search=${searchText}`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch courses:', error);
        setLoading(false);
      });
  };

  // S4.1 — Load courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Courses
      </h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const value = e.target.value;
            setSearch(value);
            fetchCourses(value);
          }}
          placeholder="Search courses..."
          className="w-full rounded-lg border border-slate-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Courses table */}
      <div className="overflow-hidden rounded-lg border border-slate-300">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">
                ID
              </th>

              <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">
                Course Name
              </th>

              <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">
                Fee
              </th>

              <th className="border border-slate-300 px-4 py-3 text-left font-semibold text-slate-700">
                Seats
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="border border-slate-300 px-4 py-3 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              courses.map((course, index) => (
                <tr
                  key={course.id}
                  className={
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }
                >
                  <td className="border border-slate-300 px-4 py-3">
                    {course.id}
                  </td>

                  <td className="border border-slate-300 px-4 py-3">
                    {course.name}
                  </td>

                  <td className="border border-slate-300 px-4 py-3">
                    ${course.fee}
                  </td>

                  <td className="border border-slate-300 px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-sm font-medium text-white ${
                        course.seatsAvailable > 0
                          ? 'bg-green-600'
                          : 'bg-red-600'
                      }`}
                    >
                      {course.seatsAvailable} / {course.seatsTotal}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        TODO: build the Courses page here.
      </p>
    </section>
  );
}