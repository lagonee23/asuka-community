/* global __app_id, __firebase_config, __initial_auth_token */
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore'; 

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
  const [isRegistering, setIsRegistering] = useState(false); // 회원가입 폼인지 여부

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
        
        // 로컬 개발 환경을 위한 Firebase 설정 객체. 
        // __firebase_config가 정의되지 않았다면 이 값을 사용합니다.
        // Firebase Console에서 복사한 실제 값으로 교체했습니다.
        const localFirebaseConfig = {
          apiKey: "AIzaSyAtSK-TwmpiRi5OHfrX0KITcNfekRYvif0",
          authDomain: "asuka-2a6e4.firebaseapp.com",
          projectId: "asuka-2a6e4",
          storageBucket: "asuka-2a6e4.firebasestorage.app",
          messagingSenderId: "772000658049",
          appId: "1:772000658049:web:500a05f52fa8dff1b7d380",
          measurementId: "G-7K12F15T2S"
        };

        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : localFirebaseConfig;

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
          // 사용자에게 오류 메시지 표시
          setAuthError(`초기 로그인 실패: ${initialSignInError.message || initialSignInError.code}. Firebase 콘솔에서 익명 인증이 활성화되어 있는지 확인하세요.`);
          setLoadingAuth(false); // 초기 로그인 실패 시에도 로딩 중지
          return; // 이 단계에서 치명적인 오류 발생 시 더 이상 진행하지 않음
        }

        // 초기 로그인 시도가 완료된 후 인증 상태 리스너 설정
        authUnsubscribe = onAuthStateChanged(authInstance, async (user) => {
          console.log("onAuthStateChanged 콜백 실행. 사용자:", user ? user.uid : "null (로그아웃 상태)");

          // 기존 프로필 리스너가 있다면 해제
          if (currentProfileUnsubscribe) {
            currentProfileUnsubscribe();
            currentProfileUnsubscribe = null; // 리스너 해제 후 초기화
            console.log("이전 사용자 프로필 리스너 해제됨.");
          }

          if (user) {
            setCurrentUser(user);
            setUserId(user.uid);
            console.log(`사용자 ${user.uid}가 로그인되었습니다. 프로필 로드 시도 중...`);

            // 사용자의 UID가 Firestore 보안 규칙과 일치하는지 확인하기 위한 로그
            console.log(`Firestore 프로필 경로: artifacts/${appId}/users/${user.uid}/profile/public`);
            
            // 사용자 프로필 Firestore에서 불러오기 (실시간 리스너)
            // 참고: Firestore 보안 규칙에 따라 /artifacts/{appId}/users/{userId}/profile/public 에 접근 권한이 있어야 합니다.
            const userDocRef = doc(dbInstance, `artifacts/${appId}/users/${user.uid}/profile`, 'public');
            currentProfileUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) {
                console.log("사용자 프로필 데이터 로드됨:", docSnap.data());
                setUserProfile(docSnap.data());
              } else {
                console.log("사용자 프로필을 찾을 수 없음. 기본 프로필 생성 시도 중...");
                // 프로필이 없으면 기본 프로필 생성
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
              setLoadingAuth(false); // 프로필 상태가 결정되면 로딩 중지
            }, (profileSnapshotError) => {
              console.error("사용자 프로필 리스닝 중 오류 발생 (onSnapshot 콜백 오류):", profileSnapshotError);
              setAuthError(`사용자 프로필 로드 중 오류: ${profileSnapshotError.message}`);
              setLoadingAuth(false); // Firestore 리스너 실패 시 로딩 중지
            });
          } else {
            console.log("인증된 사용자 없음. 현재 사용자를 null로 설정.");
            setCurrentUser(null);
            setUserId(null);
            setUserProfile(null);
            setLoadingAuth(false); // 인증된 사용자가 없으면 로딩 중지
          }
        });

      } catch (e) {
        console.error("useEffect에서 치명적인 Firebase 초기화 오류 발생:", e);
        setAuthError(`Firebase 초기화 중 치명적인 오류: ${e.message}`);
        setLoadingAuth(false); // 모든 치명적인 오류 발생 시 로딩 중지
      }
    })(); // 비동기 즉시 실행 함수 끝

    // useEffect 정리 함수: 리스너 해제
    return () => {
      console.log("useEffect 정리 함수 시작.");
      if (authUnsubscribe) {
        authUnsubscribe();
        console.log("인증 상태 리스너 해제됨.");
      }
      if (currentProfileUnsubscribe) { // 정리 시에도 프로필 리스너 해제
        currentProfileUnsubscribe();
        console.log("Firestore 프로필 리스너 해제됨.");
      }
    };
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

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
      // 사용자 프로필 Firestore에 저장
      await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'public'), {
        email: user.email,
        username: email.split('@')[0], // 이메일 앞부분을 사용자 이름으로 임시 설정
        createdAt: new Date().toISOString(),
        // 다른 기본 프로필 정보 추가 가능
      });
      // 성공 메시지 또는 자동 로그인 (onAuthStateChanged가 처리)
      setEmail('');
      setPassword('');
      setIsRegistering(false); // 회원가입 후 로그인 폼으로 전환
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
  }, [auth, db, email, password, setIsRegistering, setAuthError]); // 의존성 배열 추가

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
      // 로그인 성공 (onAuthStateChanged가 처리)
      setEmail('');
      setPassword('');
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
  }, [auth, email, password, setAuthError]); // 의존성 배열 추가

  // 로그아웃 처리 함수 (useCallback으로 래핑)
  const handleLogout = useCallback(async () => {
    if (!auth) {
      setAuthError("Firebase가 초기화되지 않았습니다.");
      return;
    }
    try {
      await signOut(auth);
      // 로그아웃 성공 (onAuthStateChanged가 처리)
      setAuthError(null); // 오류 메시지 초기화
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError("로그아웃 중 오류가 발생했습니다: " + error.message);
    }
  }, [auth, setAuthError]); // 의존성 배열 추가

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-inter">
      {/* Tailwind CSS와 웹 폰트 로드 스크립트를 App.js에서 제거했습니다. */}
      {/* 이 스크립트들은 public/index.html 파일의 <head> 섹션에 위치해야 합니다. */}
      {/* <script src="https://cdn.tailwindcss.com"></script> */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet" /> */}

      {/* 커뮤니티 헤더 섹션 - 배경, 테두리, 그림자 제거 */}
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

      {/* 새로운 메뉴 바 섹션 */}
      <nav className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 mb-8 flex justify-start items-center space-x-6 sm:space-x-8 pl-8">
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">홈</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">게시판</div>
        <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">새 글 작성</div>
        {currentUser ? (
          <>
            <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">내 정보</div>
            <div
              onClick={handleLogout}
              className="cursor-pointer text-lg font-medium text-red-600 hover:text-red-800 transition duration-300"
            >
              로그아웃
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => setIsRegistering(false)}
              className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300"
            >
              로그인
            </div>
            <div
              onClick={() => setIsRegistering(true)}
              className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300"
            >
              회원가입
            </div>
          </>
        )}
      </nav>

      {/* 메인 콘텐츠 영역 - '최신 게시물'과 '로그인' 섹션을 위한 Flex 컨테이너 */}
      <main className="w-full max-w-6xl flex flex-col lg:flex-row lg:gap-8 flex-1">
        {/* 최신 게시물 섹션 (왼쪽 컬럼) */}
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

        {/* 로그인/사용자 정보 섹션 (오른쪽 컬럼) */}
        <aside className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full lg:w-1/3 h-fit">
          {authError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">오류:</strong>
              <span className="block sm:inline ml-2">{authError}</span>
            </div>
          )}

          {currentUser ? (
            // 사용자가 로그인했을 때
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
              {/* 추가 프로필 정보나 대시보드 링크 등을 여기에 표시할 수 있습니다. */}
            </div>
          ) : (
            // 사용자가 로그인하지 않았을 때 (로그인 또는 회원가입 폼)
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-purple-200 pb-2">
                {isRegistering ? '회원가입' : '로그인'}
              </h3>
              <form onSubmit={isRegistering ? handleRegister : handleLogin} className="flex flex-col space-y-4">
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
                  {isRegistering ? '회원가입' : '로그인'}
                </button>
              </form>
              <div className="mt-4 text-center text-sm">
                {isRegistering ? (
                  <div
                    onClick={() => setIsRegistering(false)}
                    className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block"
                  >
                    이미 계정이 있으신가요? 로그인
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => setIsRegistering(true)}
                      className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block"
                    >
                      회원가입
                    </div>
                    <span className="text-gray-400">|</span>
                    <div className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">비밀번호 찾기</div>
                  </>
                )}
              </div>
            </>
          )}
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
