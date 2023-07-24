import { useState } from 'react';
import { read, utils, writeFile } from 'xlsx';
import { FaDownload } from 'react-icons/fa';

const HomeComponent = () => {
  const [movies, setMovies] = useState([]);

  const handleImport = ($event) => {
    const files = $event.target.files;
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = read(data, { type: 'array' });
        const sheets = workbook.SheetNames;

        if (sheets.length) {
          const rows = utils.sheet_to_json(workbook.Sheets[sheets[0]]);
          setMovies(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = () => {
    const headings = [[
      'Movie',
      'Category',
      'Director',
      'Rating',
    ]];

    const wb = utils.book_new();
    const ws = utils.json_to_sheet([]);
    utils.sheet_add_json(ws, headings);
    utils.sheet_add_json(ws, movies, { skipHeader: true, origin: 'A2' });
    utils.book_append_sheet(wb, ws, 'Report');
    writeFile(wb, 'Movie Report.xlsx');
  };

  return (
    <>
      <div className="mb-2 mt-5">
        <div className="sm:col-span-6 sm:col-start-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative">
                <input
                  type="file"
                  name="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="inputGroupFile"
                  required
                  onChange={handleImport}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                />
                <label
                  className="w-full px-4 py-2 text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600"
                  htmlFor="inputGroupFile"
                >
                  Choose file
                </label>
              </div>
            </div>
            <div>
              <button
                onClick={handleExport}
                className="px-4 py-2 items-center text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Export <FaDownload className="inline-block" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="sm:col-span-6 sm:col-start-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Id</th>
                <th className="px-4 py-2">Movie</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Director</th>
                <th className="px-4 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {movies.length ? (
                movies.map((movie, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{movie.Movie}</td>
                    <td className="px-4 py-2">{movie.Category}</td>
                    <td className="px-4 py-2">{movie.Director}</td>
                    <td className="px-4 py-2">
                      <span className="px-2 py-1 text-white bg-yellow-400 rounded-md">
                        {movie.Rating}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-2 text-center">
                    No Movies Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HomeComponent;
