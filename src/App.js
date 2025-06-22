import React from 'react';

// 메인 애플리케이션 컴포넌트
function App() {
  return (
    // 전체 페이지 컨테이너. 화면 전체를 채우고 내용을 중앙에 배치합니다.
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-inter">

      {/* 커뮤니티 헤더 섹션 */}
      <header className="w-full max-w-6xl pl-0 py-0 sm:py-0 mb-2 flex flex-col items-start">
        {/* 커뮤니티 이름 */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-0 animate-pulse">
          ASUKA
        </h1>
        {/* 슬로건 또는 설명 */}
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
          アニメ好きですか
        </p>
      </header>

      <nav className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-start items-center space-x-6 sm:space-x-8 pl-8">
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">홈</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">게시판</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">새 글 작성</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">내 정보</div>
      </nav>

      {/* 메인 콘텐츠 영역 - '최신 게시물'과 '로그인' 섹션을 위한 Flex 컨테이너 */}
      {/* <main className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1"> */}
      <main className="w-full max-w-6xl flex flex-col lg:flex-row lg:gap-8 flex-1">
        {/* 최신 게시물 섹션 (왼쪽 컬럼) */}
        {/* 모바일에서는 아래로 쌓이고, 데스크톱에서는 2/3 너비를 차지합니다. */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 lg:mb-0 w-full lg:w-2/3">
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
        </section>
        {/* 로그인 섹션 (오른쪽 컬럼) */}
        {/* 모바일에서는 아래로 쌓이고, 데스크톱에서는 1/3 너비를 차지합니다. */}
        <aside className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full lg:w-1/3 h-fit"> {/* h-fit 추가로 높이 자동 조절 */}
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
            로그인
          </h3>
          <form className="flex flex-col space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                아이디 또는 이메일
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="아이디 또는 이메일을 입력하세요"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              로그인
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <div className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">회원가입</div>
            <span className="text-gray-400">|</span>
            <div className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">비밀번호 찾기</div>
          </div>
        </aside>
      </main>

      {/* 푸터 섹션 */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 ASUKA Community. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
