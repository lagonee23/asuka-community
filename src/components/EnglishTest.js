
import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';

function EnglishTest({ db, currentUser, appId }) {
  const [words, setWords] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [testFinished, setTestFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWords = useCallback(async () => {
    if (!currentUser || !db) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`),
        where("language", "==", "english")
      );
      const querySnapshot = await getDocs(q);
      const fetchedWords = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (fetchedWords.length === 0) {
        setError("시험을 보려면 최소 1개의 영어 단어가 필요합니다.");
      } else {
        setWords(fetchedWords);
      }
    } catch (err) {
      setError("단어를 불러오는 중 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [db, currentUser, appId]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    if (currentQuestionIndex < words.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTestFinished(true);
    }
  };

  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowAnswer(false);
    setTestFinished(false);
    fetchWords(); // Re-fetch words for a new test
  };

  if (loading) {
    return <p className="text-center text-gray-700">시험 준비 중...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (testFinished) {
    return (
      <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1 flex flex-col items-center justify-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">시험 완료!</h2>
        <p className="text-xl text-gray-700 mb-6">
          총 {words.length}문제 중 {score}문제를 맞혔습니다.
        </p>
        <button 
          onClick={restartTest}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          다시 풀기
        </button>
      </section>
    );
  }

  const currentWord = words[currentQuestionIndex];

  return (
    <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1 flex flex-col items-center justify-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-blue-200 pb-2 text-center">
        영어 단어 시험
      </h2>
      <div className="w-full max-w-md">
        <div className="bg-gray-100 p-8 rounded-lg shadow-inner text-center">
          <p className="text-3xl font-bold text-gray-900">{currentWord.word}</p>
          {showAnswer && <p className="text-2xl text-indigo-600 mt-4">{currentWord.meaning}</p>}
        </div>
        
        {showAnswer ? (
          <div className="mt-6 text-center">
            <button 
              onClick={handleNextQuestion}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              다음 문제
            </button>
          </div>
        ) : (
          <div className="mt-6 flex justify-center space-x-4">
            <button 
              onClick={() => handleAnswer(true)} 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              O (알아요)
            </button>
            <button 
              onClick={() => handleAnswer(false)} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              X (몰라요)
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 text-gray-600">
        <p>문제 {currentQuestionIndex + 1} / {words.length}</p>
      </div>
    </section>
  );
}

export default EnglishTest;
