/* global __app_id, __firebase_config, __initial_auth_token */
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore'; 

// AuthFormContainer 컴포넌트: 로그인 폼을 렌더링합니다.
const AuthFormContainer = ({
  authError,
  currentUser,
  userProfile,
  userId,
  handleLogout,
  handleLogin,
  email,
  setEmail,
  password,
  setPassword,
  setCurrentPage, // 페이지 전환을 위해 추가
}) => {
  // AuthFormContainer는 기본적으로 로그인 폼을 보여줍니다.
  // 내부에서 '회원가입' 클릭 시 메인 페이지를 'register'로 전환합니다.
  const handleRegisterLinkClick = () => {
    setCurrentPage('register');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 h-fit w-full max-w-md mx-auto"> {/* 너비 조정 */}
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline ml-2">{authError}</span>
        </div>
      )}

      {currentUser ? (
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-green-200 pb-2">
            환영합니다!
          </h3>
          <p className="text-lg text-gray-700 mb-4">
            {userProfile ? `${userProfile.username} (${userProfile.email}) 님` : `${currentUser.email || '익명 사용자'} 님`}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            사용자 ID: <span className="font-mono break-all">{userId}</span>
          </p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            로그아웃
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
            로그인
          </h3>
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                required
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                required
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
            <div
              onClick={handleRegisterLinkClick} // 회원가입 페이지로 이동
              className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block"
            >
              회원가입
            </div>
            <span className="text-gray-400">|</span>
            <div className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">비밀번호 찾기</div>
          </div>
        </>
      )}
    </div>
  );
};


// RegisterPage 컴포넌트: 전용 회원가입 페이지를 렌더링합니다.
const RegisterPage = ({
  authError,
  handleRegister,
  email,
  setEmail,
  password,
  setPassword,
  setCurrentPage, // 회원가입 성공 후 페이지 전환을 위해 추가
}) => {
  const handleLoginLinkClick = () => {
    setCurrentPage('loginPage'); // 로그인 페이지로 이동
  };

  return (
    <section className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
        회원가입
      </h2>
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline ml-2">{authError}</span>
        </div>
      )}
      <form onSubmit={handleRegister} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="register-email" className="block text-gray-700 text-sm font-bold mb-2">
            이메일
          </label>
          <input
            type="email"
            id="register-email"
            name="email"
            placeholder="이메일을 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="register-password" className="block text-gray-700 text-sm font-bold mb-2">
            비밀번호
          </label>
          <input
            type="password"
            id="register-password"
            name="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          회원가입
        </button>
      </form>
      <div className="mt-4 text-center text-sm">
        <div
          onClick={handleLoginLinkClick}
          className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block"
        >
          이미 계정이 있으신가요? 로그인
        </div>
      </div>
    </section>
  );
};


function App() {
  // Firebase 관련 상태 변수
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인된 사용자 객체
  const [userId, setUserId] = useState(null); // 현재 사용자 ID
  const [loadingAuth, setLoadingAuth] = useState(true); // 인증 초기 로딩 상태
  const [authError, setAuthError] = useState(null); // 인증 관련 오류 메시지

  // 로그인/회원가입 폼 상태
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 현재 페이지 상태 (SPA 라우팅 역할)
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'vocabularyList', 'addWord', 'profile', 'register', 'loginPage'

  // 사용자 프로필 데이터 (Firestore에서 불러올 데이터)
  const [userProfile, setUserProfile] = useState(null);

  // Firebase 초기화 및 인증 상태 리스너 설정
  useEffect(() => {
    let authUnsubscribe;
    let currentProfileUnsubscribe = null; // 현재 활성 프로필 리스너의 unsubscribe 함수를 저장

    // 비동기 즉시 실행 함수를 사용하여 useEffect 내에서 await를 사용
    (async () => {
      try {
        console.log("Firebase 초기화 프로세스 시작.");
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        
        // Canvas 환경에서 __firebase_config는 전역으로 제공됩니다.
        const firebaseConfig = typeof __firebase_config !== 'undefined' 
          ? JSON.parse(__firebase_config) 
          : {}; // __firebase_config가 없을 경우 빈 객체로 초기화 (오류 핸들링을 위해)

        // Firebase 설정이 유효한지 기본적인 검사
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
            throw new Error("Firebase 설정이 누락되었거나 불완전합니다. 유효한 API Key와 Project ID를 제공해주세요.");
        }

        console.log("Firebase 설정 로드 완료. 프로젝트 ID:", firebaseConfig.projectId);

        // Firebase 앱 초기화
        const app = initializeApp(firebaseConfig);
        console.log("Firebase 앱 초기화 완료.");
        const authInstance = getAuth(app);
        setAuth(authInstance);
        const dbInstance = getFirestore(app);
        setDb(dbInstance);
        console.log("인증 및 Firestore 인스턴스 설정 완료.");

        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        // 초기 로그인 시도 (커스텀 토큰 또는 익명)
        try {
          if (initialAuthToken) {
            console.log("커스텀 토큰으로 로그인 시도 중...");
            await signInWithCustomToken(authInstance, initialAuthToken);
            console.log("커스텀 토큰으로 로그인 성공.");
          } else {
            console.log("사용자 정의 토큰 없음. 익명 로그인 시도 중...");
            await signInAnonymously(authInstance);
            console.log("익명 로그인 성공.");
          }
        } catch (initialSignInError) {
          console.error("초기 로그인 (토큰 또는 익명) 실패:", initialSignInError);
          setAuthError(`초기 로그인 실패: ${initialSignInError.message || initialSignInError.code}. Firebase 콘솔에서 익명 인증이 활성화되어 있는지 확인하세요.`);
          setLoadingAuth(false);
          return;
        }

        // 초기 로그인 시도가 완료된 후 인증 상태 리스너 설정
        authUnsubscribe = onAuthStateChanged(authInstance, async (user) => {
          console.log("onAuthStateChanged 콜백 실행. 사용자:", user ? user.uid : "null (로그아웃 상태)");
          
          if (currentProfileUnsubscribe) {
            currentProfileUnsubscribe();
            currentProfileUnsubscribe = null;
            console.log("이전 사용자 프로필 리스너 해제됨.");
          }

          if (user) {
            setCurrentUser(user);
            setUserId(user.uid);
            console.log(`사용자 ${user.uid}가 로그인되었습니다. 프로필 로드 시도 중...`);
            
            console.log(`Firestore 프로필 경로: artifacts/${appId}/users/${user.uid}/profile/public`);

            const userDocRef = doc(dbInstance, `artifacts/${appId}/users/${user.uid}/profile`, 'public');
            currentProfileUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) {
                console.log("사용자 프로필 데이터 로드됨:", docSnap.data());
                setUserProfile(docSnap.data());
              } else {
                console.log("사용자 프로필을 찾을 수 없음. 기본 프로필 생성 시도 중...");
                setDoc(userDocRef, { email: user.email, createdAt: new Date().toISOString() }, { merge: true })
                  .then(() => {
                    console.log("기본 프로필이 성공적으로 생성되었습니다.");
                    setUserProfile({ email: user.email, createdAt: new Date().toISOString() });
                  })
                  .catch((profileCreateError) => {
                    console.error("기본 사용자 프로필 생성 중 오류 발생:", profileCreateError);
                    setAuthError(`프로필 생성 오류: ${profileCreateError.message}`);
                  });
              }
              setLoadingAuth(false);
            }, (profileSnapshotError) => {
              console.error("사용자 프로필 리스닝 중 오류 발생 (onSnapshot 콜백 오류):", profileSnapshotError);
              setAuthError(`사용자 프로필 로드 중 오류: ${profileSnapshotError.message}`);
              setLoadingAuth(false);
            });
          } else {
            console.log("인증된 사용자 없음. 현재 사용자를 null로 설정.");
            setCurrentUser(null);
            setUserId(null);
            setUserProfile(null);
            setLoadingAuth(false);
          }
        });

      } catch (e) {
        console.error("useEffect에서 치명적인 Firebase 초기화 오류 발생:", e);
        setAuthError(`Firebase 초기화 중 치명적인 오류: ${e.message}`);
        setLoadingAuth(false);
      }
    })();

    return () => {
      console.log("useEffect 정리 함수 시작.");
      if (authUnsubscribe) {
        authUnsubscribe();
        console.log("인증 상태 리스너 해제됨.");
      }
      if (currentProfileUnsubscribe) {
        currentProfileUnsubscribe();
        console.log("Firestore 프로필 리스너 해제됨.");
      }
    };
  }, []);

  // 회원가입 처리 함수 (useCallback으로 래핑)
  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!auth || !db) {
      setAuthError("Firebase가 초기화되지 않았습니다.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'public'), {
        email: user.email,
        username: email.split('@')[0],
        createdAt: new Date().toISOString(),
      });
      setEmail('');
      setPassword('');
      setCurrentPage('home'); // 회원가입 성공 후 홈 페이지로 이동 (자동 로그인)
    } catch (error) {
      console.error("Error during registration:", error);
      let errorMessage = "회원가입 중 오류가 발생했습니다.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "이미 사용 중인 이메일 주소입니다.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "비밀번호는 최소 6자 이상이어야 합니다.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      }
      setAuthError(errorMessage);
    }
  }, [auth, db, email, password, setCurrentPage, setAuthError]);

  // 로그인 처리 함수 (useCallback으로 래핑)
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!auth) {
      setAuthError("Firebase가 초기화되지 않았습니다.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      setCurrentPage('home'); // 로그인 성공 후 홈 페이지로 이동
    } catch (error) {
      console.error("Error during login:", error);
      let errorMessage = "로그인 중 오류가 발생했습니다. 이메일 또는 비밀번호를 확인해주세요.";
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "유효하지 않은 이메일 또는 비밀번호입니다.";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "해당 이메일로 등록된 사용자가 없습니다.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "비밀번호가 올바르지 않습니다.";
      }
      setAuthError(errorMessage);
    }
  }, [auth, email, password, setCurrentPage, setAuthError]);

  // 로그아웃 처리 함수 (useCallback으로 래핑)
  const handleLogout = useCallback(async () => {
    if (!auth) {
      setAuthError("Firebase가 초기화되지 않았습니다.");
      return;
    }
    try {
      await signOut(auth);
      setAuthError(null);
      setCurrentPage('home'); // 로그아웃 후 홈 페이지로 이동
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError("로그아웃 중 오류가 발생했습니다: " + error.message);
    }
  }, [auth, setCurrentPage, setAuthError]);


  // 메인 콘텐츠 렌더링 함수
  const renderMainContent = () => {
    if (currentPage === 'home') {
      return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center flex-1">
          {/* 단어장 앱 환영 섹션 */}
          <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 w-full flex flex-col items-center justify-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2 text-center">
              나만의 단어장을 만들어 보세요!
            </h2>
            <p className="text-lg text-gray-700 mb-4 text-center">
              ASUKA 단어장 앱에서 새로운 단어를 추가하고, 학습하고, 관리해보세요.
            </p>
            <button
              onClick={() => setCurrentPage('addWord')}
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              새 단어 추가하기
            </button>
          </section>
        </div>
      );
    } else if (currentPage === 'loginPage') { // 새로운 로그인 페이지
        return (
            <section className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
                <AuthFormContainer
                    authError={authError}
                    currentUser={currentUser}
                    userProfile={userProfile}
                    userId={userId}
                    handleLogout={handleLogout}
                    handleLogin={handleLogin}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    setCurrentPage={setCurrentPage}
                />
            </section>
        );
    } else if (currentPage === 'register') {
      return (
        // 회원가입 전용 페이지 (전체 너비, 중앙 정렬)
        <RegisterPage
          authError={authError}
          handleRegister={handleRegister}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setCurrentPage={setCurrentPage} // 회원가입 성공 후 또는 로그인 링크 클릭 시 페이지 전환
        />
      );
    } else if (currentPage === 'vocabularyList') {
      return (
        <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
            내 단어장
          </h2>
          <div className="text-gray-500 text-center py-12">
            <p className="text-xl mb-4">여기에 저장된 단어 목록이 표시됩니다.</p>
            <p className="text-base text-gray-400">아직 단어가 없습니다. 새 단어를 추가해보세요!</p>
            <button
              onClick={() => setCurrentPage('addWord')}
              className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
            >
              단어 추가하기
            </button>
          </div>
        </section>
      );
    } else if (currentPage === 'addWord') {
      return (
        <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
            단어 추가
          </h2>
          <div className="text-gray-500 text-center py-12">
            <p className="text-xl mb-4">새로운 단어를 추가할 수 있는 폼이 여기에 옵니다.</p>
            <div className="flex flex-col space-y-4 max-w-md mx-auto">
              <div>
                <label htmlFor="word" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                  단어
                </label>
                <input
                  type="text"
                  id="word"
                  placeholder="새로운 단어를 입력하세요"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="meaning" className="block text-gray-700 text-sm font-bold mb-2 text-left">
                  의미
                </label>
                <textarea
                  id="meaning"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows="4"
                  placeholder="단어의 의미를 입력하세요..."
                ></textarea>
              </div>
              <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                단어 저장
              </button>
            </div>
          </div>
        </section>
      );
    } else if (currentPage === 'profile') {
      return (
        <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
            내 정보
          </h2>
          <div className="text-gray-500 text-center py-12">
            <p className="text-xl mb-4">사용자 프로필 정보가 여기에 표시됩니다.</p>
            {currentUser && userProfile ? (
              <div className="text-left max-w-md mx-auto">
                <p><strong>이메일:</strong> {userProfile.email}</p>
                {userProfile.username && <p><strong>사용자 이름:</strong> {userProfile.username}</p>}
                <p><strong>가입일:</strong> {new Date(userProfile.createdAt).toLocaleDateString('ko-KR')}</p>
                <p className="text-sm text-gray-500 mt-4">
                  (사용자 ID: <span className="font-mono break-all">{userId}</span>)
                </p>
              </div>
            ) : (
              <p>로그인 후 프로필을 확인해주세요.</p>
            )}
          </div>
        </section>
      );
    }
    return null; // 기본적으로 아무것도 렌더링하지 않음
  };

  // 인증 로딩 중일 때 표시
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center font-inter">
        <p className="text-2xl text-gray-700">인증 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    // 전체 페이지 컨테이너. 화면 전체를 채우고 내용을 중앙에 배치합니다.
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-inter"> {/* 상단 패딩 원래대로 복원 */}
      <div className="w-full max-w-6xl"> {/* Main content wrapper */}
        <header className="flex justify-between items-start mb-2"> {/* mb-2를 다시 추가 */}
          {/* Left side: App Name and Slogan */}
          {/* ASUKA와 슬로건을 같은 줄에 배치 */}
          <div className="flex items-baseline"> {/* flex-col 대신 flex와 items-baseline 사용 */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-0 animate-pulse">
              ASUKA
            </h1>
            {/* 슬로건을 ASUKA 오른쪽에 배치하고 간격 조정 */}
            <p className="text-lg sm:text-xl text-gray-600 ml-4"> {/* ml-4 추가하여 간격 조정 */}
              나만의 일본어 단어장을 만들어 보세요!
            </p>
          </div>

          {/* Right side: Login/Logout/Profile links */}
          {/* Adjusted top padding to pt-12 as requested */}
          <div className="flex flex-col items-end text-right space-y-1 pr-4 pt-12"> 
            {currentUser ? (
              <>
                <div onClick={() => setCurrentPage('profile')} className="cursor-pointer text-md font-medium text-gray-700 hover:text-indigo-600 transition duration-300">내 정보</div>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer text-md font-medium text-red-600 hover:text-red-800 transition duration-300"
                >
                  로그아웃
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={() => setCurrentPage('loginPage')}
                  className="cursor-pointer text-md font-medium text-gray-700 hover:text-indigo-600 transition duration-300"
                >
                  로그인
                </div>
                <div
                  onClick={() => setCurrentPage('register')}
                  className="cursor-pointer text-md font-medium text-gray-700 hover:text-indigo-600 transition duration-300"
                >
                  회원가입
                </div>
              </>
            )}
          </div>
        </header>

        {/* 새로운 메뉴 바 섹션 */}
        <nav className="w-full bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-start items-center space-x-6 sm:space-x-8 pl-8"> {/* mb-8을 다시 추가 */}
          <div onClick={() => setCurrentPage('home')} className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">홈</div>
          <div onClick={() => setCurrentPage('vocabularyList')} className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">단어장</div>
          <div onClick={() => setCurrentPage('addWord')} className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">단어 추가</div>
        </nav>
      </div> {/* End of w-full max-w-6xl wrapper */}

      {/* 메인 콘텐츠 영역: currentPage 값에 따라 동적으로 렌더링 */}
      <main className="w-full flex-1"> {/* flex-1로 남은 공간 차지 */}
        {renderMainContent()}
      </main>

      {/* 푸터 섹션 */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 ASUKA. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
