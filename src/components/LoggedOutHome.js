
import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-500 text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

const HowToStep = ({ number, title, children }) => (
  <div className="flex">
    <div className="flex flex-col items-center mr-4">
      <div>
        <div className="flex items-center justify-center w-10 h-10 border rounded-full">
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={`M${number === 1 ? '13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : number === 2 ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'}`}></path>
          </svg>
        </div>
      </div>
      <div className="w-px h-full bg-gray-300"></div>
    </div>
    <div className="pb-8">
      <p className="mb-2 text-lg font-bold text-gray-800">{title}</p>
      <p className="text-gray-600">{children}</p>
    </div>
  </div>
);


const LoggedOutHome = ({ handleAddWordClick }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col flex-1 space-y-12 sm:space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-white rounded-xl shadow-lg p-8 sm:p-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-4">
          당신만의 언어 학습 공간, <span className="text-indigo-600">ASUKA</span>
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          효과적인 단어 암기를 위한 최고의 파트너. 지금 바로 시작하여 외국어 실력을 한 단계 끌어올리세요.
        </p>
        <button
          onClick={handleAddWordClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 text-lg"
        >
          나만의 단어장 만들기
        </button>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">주요 기능</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-9-5.747h18"></path></svg>}
            title="나만의 단어장"
          >
            학습하고 싶은 단어들을 모아 나만의 맞춤 단어장을 만들어보세요. 영어, 일본어 등 원하는 언어로 만들 수 있습니다.
          </FeatureCard>
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m6-6l.01.01"></path></svg>}
            title="이미지로 쉽게 암기"
          >
            단어와 관련된 이미지를 추가하여 시각적으로 더 쉽고 오래 기억할 수 있습니다. 텍스트만으로는 부족할 때 최고의 효과를 발휘합니다.
          </FeatureCard>
          <FeatureCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707.707"></path></svg>}
            title="체계적인 학습과 테스트"
          >
            만든 단어장을 활용해 체계적으로 학습하고, 단어 테스트를 통해 암기한 내용을 확인하며 실력을 점검할 수 있습니다.
          </FeatureCard>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">ASUKA 사용법</h2>
        <div>
          <HowToStep number={1} title="1. 단어장 만들기">
            '내 단어장' 메뉴에서 '새 단어장'을 클릭하여 학습할 언어와 주제에 맞는 새로운 단어장을 만듭니다.
          </HowToStep>
          <HowToStep number={2} title="2. 단어 추가하기">
            생성된 단어장에 들어가 '단어 추가' 버튼으로 새로운 단어, 의미, 품사, 그리고 암기에 도움이 될 이미지를 추가합니다.
          </HowToStep>
          <HowToStep number={3} title="3. 학습 및 테스트">
            '단어 테스트' 메뉴에서 원하는 단어장을 선택하여 퀴즈를 풀며 자신의 암기 수준을 확인하고 부족한 부분을 복습합니다.
          </HowToStep>
        </div>
      </section>
    </div>
  );
};

export default LoggedOutHome;
