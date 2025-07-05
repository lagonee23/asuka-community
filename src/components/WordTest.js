
import React from 'react';
import { Link } from 'react-router-dom';

function WordTest() {
  return (
    <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1 flex flex-col items-center justify-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2 text-center">
        단어 시험
      </h2>
      <p className="text-lg text-gray-700 mb-8 text-center">
        어떤 시험을 보시겠습니까?
      </p>
      <div className="flex space-x-4">
        <Link to="/word-test/english">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
            영어 시험
          </button>
        </Link>
        <Link to="/word-test/japanese">
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
            일본어 시험
          </button>
        </Link>
      </div>
    </section>
  );
}

export default WordTest;
