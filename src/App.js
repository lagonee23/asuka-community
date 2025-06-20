import React from 'react';

// 메인 애플리케이션 컴포넌트
function App() {
  return (
    // 전체 페이지 컨테이너. 화면 전체를 채우고 내용을 중앙에 배치합니다.
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-inter">

      {/* 커뮤니티 헤더 섹션 */}
      <header className="w-full max-w-6xl p-6 sm:p-8 mb-8 flex flex-col items-center">
        {/* 커뮤니티 이름 */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-4 animate-pulse">
          ASUKA
        </h1>
        {/* 슬로건 또는 설명 */}
        <p className="text-lg sm:text-xl text-gray-600 text-center max-w-2xl">
          Anime Sukidesuka?
        </p>
      </header>

      <nav className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-center items-center space-x-6 sm:space-x-8">
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">홈</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">게시판</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">새 글 작성</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">내 정보</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">로그인</div>
      </nav>

      {/* 메인 콘텐츠 영역 (향후 커뮤니티 게시물, 기능 등이 추가될 곳) */}
      <main className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
          최신 게시물
        </h2>
        <div className="text-gray-500 text-center py-12">
          <p className="text-xl mb-4">
            <span role="img" aria-label="sparkles">✨</span>
            아직 게시물이 없습니다. 첫 게시물을 작성해주세요!
          </p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
            새 게시물 작성하기
          </button>
        </div>
        {/* 여기에 더 많은 컴포넌트나 섹션을 추가할 수 있습니다. 예를 들어, 게시물 목록, 검색 바, 사용자 프로필 등 */}
      </main>

      {/* 푸터 섹션 */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 ASUKA Community. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
