
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1`}>
    <div className={`rounded-full p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const LoggedInHome = ({ db, currentUser, appId, userProfile }) => {
  const [stats, setStats] = useState({ totalLists: 0, totalWords: 0 });
  const [recentLists, setRecentLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!db || !currentUser) return;

      setLoading(true);
      try {
        // Fetch vocab lists
        const listsRef = collection(db, `artifacts/${appId}/users/${currentUser.uid}/vocabLists`);
        const listsSnapshot = await getDocs(listsRef);
        const lists = listsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        let totalWords = 0;
        for (const list of lists) {
          const wordsRef = collection(db, `artifacts/${appId}/users/${currentUser.uid}/vocabLists/${list.id}/words`);
          const wordsSnapshot = await getDocs(wordsRef);
          totalWords += wordsSnapshot.size;
        }

        setStats({ totalLists: lists.length, totalWords });

        // Fetch recent lists
        const recentListsQuery = query(listsRef, orderBy('createdAt', 'desc'), limit(3));
        const recentListsSnapshot = await getDocs(recentListsQuery);
        const fetchedRecentLists = recentListsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentLists(fetchedRecentLists);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [db, currentUser, appId]);

  if (loading) {
    return <p className="text-center text-gray-700">대시보드를 불러오는 중...</p>;
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col flex-1 space-y-8">
      {/* Welcome Header */}
      <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          환영합니다, {userProfile?.username || currentUser.email}님!
        </h2>
        <p className="text-lg text-gray-600 mt-2">
          오늘도 즐겁게 학습해 보세요. 
        </p>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-2 gap-6">
        <StatCard 
          title="총 단어장 수" 
          value={stats.totalLists} 
          color="bg-blue-100 text-blue-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>}
        />
        <StatCard 
          title="총 단어 수" 
          value={stats.totalWords} 
          color="bg-green-100 text-green-600"
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h6l2-2h2l-2 2z"></path></svg>}
        />
      </section>

      {/* Quick Access Section */}
      <section>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">최근 단어장</h3>
        {recentLists.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentLists.map(list => (
              <Link key={list.id} to={`/vocabulary/${list.language}/${list.id}`} className="block bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <h4 className="text-xl font-bold text-gray-800">{list.name}</h4>
                <span className={`mt-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${list.language === 'japanese' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {list.language === 'japanese' ? '일본어' : '영어'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-lg shadow-lg p-8">
            <p className="text-gray-600 mb-4">아직 생성된 단어장이 없습니다. 첫 단어장을 만들어 보세요!</p>
            <Link to="/vocabulary/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300">
              단어장 만들러 가기
            </Link>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="text-center bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">오늘의 학습을 시작해볼까요?</h3>
        <div className="flex justify-center space-x-4">
          <Link to="/vocabulary" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
            내 단어장 보기
          </Link>
          <Link to="/word-test" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300">
            단어 테스트
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LoggedInHome;
