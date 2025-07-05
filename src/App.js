/* global __app_id, __firebase_config */
import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, getDoc, collection, query, where, deleteDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// AuthFormContainer component: Renders the login form.
// If the user clicks the registration link, it navigates to a dedicated registration page.
const AuthFormContainer = ({
  authError,
  currentUser,
  userProfile,
  userId,
  handleLogout,
  handleLogin,
  handleGoogleSignIn, // Added for Google Sign-In
  email,
  setEmail,
  password,
  setPassword,
}) => {

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 h-fit w-full max-w-md mx-auto"> {/* Width adjustment */}
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
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 mt-2"
            >
              Google 계정으로 로그인
            </button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/register" className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">
              회원가입
            </Link>
            <span className="text-gray-400">|</span>
            <div className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">비밀번호 찾기</div>
          </div>
        </>
      )}
    </div>
  );
};


// RegisterPage component: Renders a dedicated registration page.
const RegisterPage = ({
  authError,
  handleRegister,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
}) => {

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
          <label htmlFor="register-username" className="block text-gray-700 text-sm font-bold mb-2">
            사용자 이름
          </label>
          <input
            type="text"
            id="register-username"
            name="username"
            placeholder="사용자 이름을 입력하세요"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>
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
        <Link to="/login" className="cursor-pointer text-indigo-600 hover:underline mx-2 inline-block">
          이미 계정이 있으신가요? 로그인
        </Link>
      </div>
    </section>
  );
};


const VocabularyList = ({ auth, db, currentUser, userId, appId, handleDeleteWord }) => {
  const { language } = useParams();
  const [vocabulary, setVocabulary] = useState([]);
  const [loadingVocabulary, setLoadingVocabulary] = useState(true);
  const [vocabularyError, setVocabularyError] = useState(null);

  useEffect(() => {
    if (!currentUser || !db || !language) {
      setVocabulary([]);
      setLoadingVocabulary(false);
      return;
    }

    setLoadingVocabulary(true);
    setVocabularyError(null);

    const vocabularyCollectionRef = collection(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`);
    const q = query(vocabularyCollectionRef, where("language", "==", language));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const words = [];
      snapshot.forEach(doc => {
        words.push({ id: doc.id, ...doc.data() });
      });
      setVocabulary(words);
      setLoadingVocabulary(false);
      console.log(`Vocabulary loaded for ${language}:`, words);
    }, (error) => {
      console.error(`Error loading ${language} vocabulary:`, error);
      setVocabularyError(`단어장 불러오기 오류: ${error.message}`);
      setLoadingVocabulary(false);
    });

    return () => unsubscribe();
  }, [currentUser, db, language, appId]); // Depend on currentUser, db, language, appId

  if (loadingVocabulary) {
    return <p className="text-center text-gray-700">단어장을 불러오는 중...</p>;
  }

  if (vocabularyError) {
    return <p className="text-center text-red-500">{vocabularyError}</p>;
  }

  if (!currentUser) {
    return <p className="text-center text-gray-500">로그인 후 단어장을 확인해주세요.</p>;
  }

  return (
    <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b-2 border-indigo-200 pb-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {language === 'japanese' ? '일본어 단어장' : '영어 단어장'}
        </h2>
        <Link to={`/add-word/${language}`} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
          추가
        </Link>
      </div>
      {vocabulary.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vocabulary.map((item) => (
            <div key={item.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.word}</h3>
                <p className="text-gray-600">{item.meaning}</p>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Link to={`/edit-word/${language}/${item.id}`} className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-1 px-3 rounded-lg transition duration-300">
                  수정
                </Link>
                <button
                  onClick={() => handleDeleteWord(language, item.id)}
                  className="text-sm bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-lg transition duration-300"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-12 flex-1 flex flex-col justify-center items-center">
          <p className="text-xl mb-4">아직 단어가 없습니다. 새 단어를 추가해보세요!</p>
          <Link to={`/add-word/${language}`} className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
            단어 추가하기
          </Link>
        </div>
      )}
    </section>
  );
};

const AddWordForm = ({
  authError,
  setAuthError,
  word,
  setWord,
  meaning,
  setMeaning,
  selectedLanguage,
  setSelectedLanguage,
  handleSaveWord,
}) => {
  const langFromUrl = useParams().lang; // Get lang from URL for initial setting

  useEffect(() => {
    if (langFromUrl) {
      setSelectedLanguage(langFromUrl);
    }
  }, [langFromUrl, setSelectedLanguage]);

  return (
    <div className="text-gray-500 text-center py-12">
      <p className="text-xl mb-4">새로운 단어를 추가할 수 있는 폼이 여기에 옵니다.</p>
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">오류:</strong>
          <span className="block sm:inline ml-2">{authError}</span>
        </div>
      )}
      <div className="flex flex-col space-y-4 max-w-md mx-auto">
        {/* Language Selection - Conditionally rendered */}
        {!langFromUrl && ( // Use langFromUrl to conditionally render
          <div className="flex items-center space-x-4 mb-4">
            <span className="block text-gray-700 text-sm font-bold">언어 선택:</span>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="language"
                value="japanese"
                checked={selectedLanguage === 'japanese'}
                onChange={() => setSelectedLanguage('japanese')}
              />
              <span className="ml-2 text-gray-700">일본어</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-indigo-600"
                name="language"
                value="english"
                checked={selectedLanguage === 'english'}
                onChange={() => setSelectedLanguage('english')}
              />
              <span className="ml-2 text-gray-700">영어</span>
            </label>
          </div>
        )}
        <div>
          <label htmlFor="word" className="block text-gray-700 text-sm font-bold mb-2 text-left">
            단어
          </label>
          <input
            type="text"
            id="word"
            placeholder="새로운 단어를 입력하세요"
            value={word}
            onChange={(e) => {
              console.log("Word input changed:", e.target.value);
              setWord(e.target.value);
            }}
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
            value={meaning}
            onChange={(e) => {
              console.log("Meaning textarea changed:", e.target.value);
              setMeaning(e.target.value);
            }}
          ></textarea>
        </div>
        <button
          onClick={handleSaveWord}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
          단어 저장
        </button>
      </div>
    </div>
  );
};

const AddWordPage = ({ authError, setAuthError, word, setWord, meaning, setMeaning, selectedLanguage, setSelectedLanguage, handleSaveWord }) => {
  const { lang } = useParams();

  const title = lang === 'japanese' ? '일본어 단어장에 추가' : lang === 'english' ? '영어 단어장에 추가' : '단어 추가';

  return (
    <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
        {title}
      </h2>
      <AddWordForm
        authError={authError}
        setAuthError={setAuthError}
        word={word}
        setWord={setWord}
        meaning={meaning}
        setMeaning={setMeaning}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        handleSaveWord={handleSaveWord}
      />
    </section>
  );
};

const EditWordPage = ({ auth, db, currentUser, handleUpdateWord, setAuthError, authError }) => {
  const { language, wordId } = useParams();
  const navigate = useNavigate();

  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db || !currentUser) {
      navigate('/login');
      return;
    }

    const fetchWord = async () => {
      try {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const wordRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`, wordId);
        const docSnap = await getDoc(wordRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setWord(data.word);
          setMeaning(data.meaning);
        } else {
          console.error("No such document!");
          setAuthError("수정할 단어를 찾을 수 없습니다.");
          navigate(`/vocabulary/${language}`);
        }
      } catch (error) {
        console.error("Error fetching word:", error);
        setAuthError(`단어 정보를 불러오는 중 오류가 발생했습니다: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [db, currentUser, wordId, language, navigate, setAuthError]);

  const onUpdate = () => {
    handleUpdateWord(wordId, word, meaning, language);
  };

  if (loading) {
    return <p className="text-center text-gray-700">단어 정보를 불러오는 중...</p>;
  }

  const title = language === 'japanese' ? '일본어 단어 수정' : '영어 단어 수정';

  return (
    <section className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2">
        {title}
      </h2>
      <div className="text-gray-500 text-center py-12">
        {authError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">오류:</strong>
            <span className="block sm:inline ml-2">{authError}</span>
          </div>
        )}
        <div className="flex flex-col space-y-4 max-w-md mx-auto">
          <div>
            <label htmlFor="word" className="block text-gray-700 text-sm font-bold mb-2 text-left">
              단어
            </label>
            <input
              type="text"
              id="word"
              placeholder="단어를 입력하세요"
              value={word}
              onChange={(e) => setWord(e.target.value)}
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
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            ></textarea>
          </div>
          <button
            onClick={onUpdate}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
          >
            단어 수정
          </button>
        </div>
      </div>
    </section>
  );
};

function App() {
  const navigate = useNavigate();
  // Firebase related state variables
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Current logged-in user object
  const [userId, setUserId] = useState(null); // Current user ID
  const [loadingAuth, setLoadingAuth] = useState(true); // Initial authentication loading state
  const [authError, setAuthError] = useState(null); // Authentication related error message

  // Login/Registration form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('japanese'); // New state for language selection

  // User profile data (data to be loaded from Firestore)
  const [userProfile, setUserProfile] = useState(null);

  // Firebase initialization and authentication state listener setup
  useEffect(() => {
    let authUnsubscribe;
    let currentProfileUnsubscribe = null; // Stores the unsubscribe function for the currently active profile listener

    // Use an async IIFE to use await inside useEffect
    (async () => {
      try {
        console.log("Starting Firebase initialization process.");
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        
        // In the Canvas environment, __firebase_config is provided globally.
        const firebaseConfig = typeof __firebase_config !== 'undefined'
          ? JSON.parse(__firebase_config)
          : {
              apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
              authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
              projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
              storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
              messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
              appId: process.env.REACT_APP_FIREBASE_APP_ID,
            };

        // Basic validation for Firebase configuration
        if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
            throw new Error("Firebase configuration is missing or incomplete. Please provide a valid API Key and Project ID.");
        }

        console.log("Firebase configuration loaded successfully. Project ID:", firebaseConfig.projectId);

        // Initialize Firebase app
        const app = initializeApp(firebaseConfig);
        console.log("Firebase app initialized.");
        const authInstance = getAuth(app);
        setAuth(authInstance);
        const dbInstance = getFirestore(app);
        setDb(dbInstance);
        console.log("Auth and Firestore instances set up.");

        // Set up authentication state listener.
        // This will automatically handle restoring user sessions.
        authUnsubscribe = onAuthStateChanged(authInstance, async (user) => {
          console.log("onAuthStateChanged callback executed. User:", user ? user.uid : "null (logged out)");
          
          if (currentProfileUnsubscribe) {
            currentProfileUnsubscribe();
            currentProfileUnsubscribe = null;
            console.log("Previous user profile listener unsubscribed.");
          }

          if (user) {
            setCurrentUser(user);
            setUserId(user.uid);
            console.log(`User ${user.uid} logged in. Attempting to load profile...`);
            
            console.log(`Firestore profile path: artifacts/${appId}/users/${user.uid}/profile/public`);

            const userDocRef = doc(dbInstance, `artifacts/${appId}/users/${user.uid}/profile`, 'public');
            currentProfileUnsubscribe = onSnapshot(userDocRef, (docSnap) => {
              if (docSnap.exists()) {
                console.log("User profile data loaded:", docSnap.data());
                setUserProfile(docSnap.data());
              } else {
                console.log("User profile not found. Attempting to create default profile...");
                setDoc(userDocRef, { email: user.email, createdAt: new Date().toISOString() }, { merge: true })
                  .then(() => {
                    console.log("Default profile created successfully.");
                    setUserProfile({ email: user.email, createdAt: new Date().toISOString() });
                  })
                  .catch((profileCreateError) => {
                    console.error("Error creating default user profile:", profileCreateError);
                    setAuthError(`Profile creation error: ${profileCreateError.message}`);
                  });
              }
              setLoadingAuth(false);
            }, (profileSnapshotError) => {
              console.error("Error listening to user profile (onSnapshot callback error):", profileSnapshotError);
              setAuthError(`Error loading user profile: ${profileSnapshotError.message}`);
              setLoadingAuth(false);
            });

            // Fetch vocabulary
            // const vocabularyCollectionRef = collection(dbInstance, `artifacts/${appId}/users/${user.uid}/vocabulary`);
            // onSnapshot(vocabularyCollectionRef, (snapshot) => {
            //   const words = [];
            //   snapshot.forEach(doc => {
            //     words.push({ id: doc.id, ...doc.data() });
            //   });
            //   setVocabulary(words);
            //   console.log("Vocabulary loaded:", words);
            // }, (error) => {
            //   console.error("Error loading vocabulary:", error);
            // });

          } else {
            console.log("No authenticated user. Setting current user to null.");
            setCurrentUser(null);
            setUserId(null);
            setUserProfile(null);
            // setVocabulary([]); // Clear vocabulary on logout
            setLoadingAuth(false);
          }
        });

      } catch (e) {
        console.error("Fatal Firebase initialization error in useEffect:", e);
        setAuthError(`Fatal Firebase initialization error: ${e.message}`);
        setLoadingAuth(false);
      }
    })();

    return () => {
      console.log("useEffect cleanup function started.");
      if (authUnsubscribe) {
        authUnsubscribe();
        console.log("Auth state listener unsubscribed.");
      }
      if (currentProfileUnsubscribe) {
        currentProfileUnsubscribe();
        console.log("Firestore profile listener unsubscribed.");
      }
    };
  }, []);

  // Registration handler function (wrapped with useCallback)
  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!auth || !db) {
      setAuthError("Firebase is not initialized.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      await setDoc(doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'public'), {
        email: user.email,
        username: username,
        createdAt: new Date().toISOString(),
      });
      setEmail('');
      setPassword('');
      setUsername('');
      navigate('/'); // Navigate to home page after successful registration (auto-login)
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
  }, [auth, db, email, password, username, navigate, setAuthError]);

  // Login handler function (wrapped with useCallback)
  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setAuthError(null);
    if (!auth) {
      setAuthError("Firebase is not initialized.");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setEmail('');
      setPassword('');
      navigate('/'); // Navigate to home page after successful login
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
  }, [auth, email, password, navigate, setAuthError]);

  const handleGoogleSignIn = useCallback(async () => {
    if (!auth || !db) {
      setAuthError("Firebase is not initialized.");
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/profile`, 'public');
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // Create profile if it doesn't exist
        await setDoc(userDocRef, {
          email: user.email,
          username: user.displayName || 'Google User',
          createdAt: new Date().toISOString(),
        });
      }

      navigate('/');
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setAuthError(`Google 로그인 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [auth, db, navigate, setAuthError]);

  const handleAddWordClick = useCallback(() => {
    if (currentUser) {
      navigate('/add-word');
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Logout handler function (wrapped with useCallback)
  const handleLogout = useCallback(async () => {
    if (!auth) {
      setAuthError("Firebase is not initialized.");
      return;
    }
    try {
      await signOut(auth);
      setAuthError(null);
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.error("Error during logout:", error);
      setAuthError("로그아웃 중 오류가 발생했습니다: " + error.message);
    }
  }, [auth, navigate, setAuthError]);

  // Save word handler function
  const handleSaveWord = useCallback(async () => {
    console.log("handleSaveWord called.");
    console.log("auth:", auth, "db:", db, "currentUser:", currentUser);
    console.log("word:", word, "meaning:", meaning);

    if (!auth || !db || !currentUser) {
      console.log("Auth, DB, or currentUser not initialized. Redirecting to login.");
      setAuthError("로그인 후 단어를 저장할 수 있습니다.");
      navigate('/login');
      return;
    }
    if (!word.trim() || !meaning.trim()) {
      console.log("Word or meaning is empty.");
      setAuthError("단어와 의미를 모두 입력해주세요.");
      return;
    }

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      console.log(`Attempting to save word to: artifacts/${appId}/users/${currentUser.uid}/vocabulary/${word}`);
      const wordRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`, word); // Use word as document ID
      await setDoc(wordRef, {
        word: word,
        meaning: meaning,
        language: selectedLanguage, // Add language field
        createdAt: new Date().toISOString(),
      }, { merge: true });
      console.log("Word saved successfully!");
      setWord('');
      setMeaning('');
      setAuthError(null);
      navigate(`/vocabulary/${selectedLanguage}`); // Navigate to vocabulary page after saving
    } catch (error) {
      console.error("Error saving word:", error);
      setAuthError(`단어 저장 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [auth, db, currentUser, word, meaning, selectedLanguage, navigate, setAuthError]);

  const handleDeleteWord = useCallback(async (language, wordId) => {
    if (!db || !currentUser) {
      setAuthError("로그인 후 단어를 삭제할 수 있습니다.");
      navigate('/login');
      return;
    }

    if (!window.confirm("정말로 이 단어를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const wordRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`, wordId);
      await deleteDoc(wordRef);
      console.log("Word deleted successfully!");
      // No need to navigate, onSnapshot will update the list
    } catch (error) {
      console.error("Error deleting word:", error);
      setAuthError(`단어 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [db, currentUser, navigate, setAuthError]);

  const handleUpdateWord = useCallback(async (wordId, newWord, newMeaning, language) => {
    console.log("handleUpdateWord called for wordId:", wordId);

    if (!db || !currentUser) {
      setAuthError("로그인 후 단어를 수정할 수 있습니다.");
      navigate('/login');
      return;
    }
    if (!newWord.trim() || !newMeaning.trim()) {
      setAuthError("단어와 의미를 모두 입력해주세요.");
      return;
    }

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const oldWordRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`, wordId);

    try {
      const originalDocSnap = await getDoc(oldWordRef);
      if (!originalDocSnap.exists()) {
        setAuthError("수정하려는 단어를 찾을 수 없습니다.");
        return;
      }
      const originalData = originalDocSnap.data();

      // If the word itself hasn't changed, just update the meaning.
      if (wordId === newWord) {
        await updateDoc(oldWordRef, {
          meaning: newMeaning,
          updatedAt: new Date().toISOString(),
        });
        console.log("Word meaning updated successfully!");
      } else {
        // If the word has changed, we need to delete the old doc and create a new one in a batch.
        const newWordRef = doc(db, `artifacts/${appId}/users/${currentUser.uid}/vocabulary`, newWord);
        
        // Check if the new word already exists to prevent overwriting
        const newWordSnap = await getDoc(newWordRef);
        if (newWordSnap.exists()) {
            setAuthError("이미 존재하는 단어입니다. 다른 단어를 사용해주세요.");
            return;
        }

        const batch = writeBatch(db);

        // 1. Create the new document
        batch.set(newWordRef, {
          ...originalData, // copy over old data like language, createdAt
          word: newWord,
          meaning: newMeaning,
          updatedAt: new Date().toISOString(),
        });

        // 2. Delete the old document
        batch.delete(oldWordRef);

        // 3. Commit the batch
        await batch.commit();
        console.log("Word updated successfully (delete and create).");
      }

      setAuthError(null);
      navigate(`/vocabulary/${language}`);
    } catch (error) {
      console.error("Error updating word:", error);
      setAuthError(`단어 수정 중 오류가 발생했습니다: ${error.message}`);
    }
  }, [db, currentUser, navigate, setAuthError]);


  // Display loading state for authentication
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center justify-center font-inter">
        <p className="text-2xl text-gray-700">인증 정보를 불러오는 중...</p>
      </div>
    );
  }

  return (
    // Overall page container. Fills the entire screen and centers content.
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-inter"> {/* Restored original top padding */}
      <div className="w-full max-w-6xl"> {/* Main content wrapper */}
        <header className="flex justify-between items-baseline mb-0">
          {/* Left side: App Name and Slogan */}
          {/* Changed to flex and items-baseline to put slogan on the same line as ASUKA */}
          <div className="flex items-end">
            <Link to="/" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-700 mb-0 animate-pulse cursor-pointer">
              ASUKA
            </Link>
            {/* Slogan positioned to the right of ASUKA with margin */}
            <p className="text-lg sm:text-xl text-gray-600 ml-4"> 
              나만의 일본어 단어장을 만들어 보세요!
            </p>
          </div>

          {/* Right side: Login/Logout/Profile links */}
          {/* Adjusted top padding to pt-12 as requested */}
          <div className="flex flex-col items-end justify-end text-right space-y-1 self-end">
            {currentUser ? (
              <>
                <Link to="/profile" className="cursor-pointer text-md font-medium text-gray-700 hover:text-indigo-600 transition duration-300">내 정보</Link>
                <div
                  onClick={handleLogout}
                  className="cursor-pointer text-md font-medium text-red-600 hover:text-red-800 transition duration-300"
                >
                  로그아웃
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="cursor-pointer text-md font-medium text-gray-700 hover:text-indigo-600 transition duration-300">
                  로그인
                </Link>
                <Link to="/register" className="cursor-pointer text-md font-medium text-gray-700 hover:text-indigo-600 transition duration-300">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </header>

        {/* New navigation bar section */}
        <nav className="w-full bg-white rounded-xl shadow-lg p-4 mb-4 mt-2 flex justify-start items-center space-x-6 sm:space-x-8 pl-8">
          <Link to="/" className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">홈</Link>
          
          {/* Dropdown for Vocabulary */}
          <div className="relative group">
            <div className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">
              내 단어장
            </div>
            <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-300 invisible">
              <Link to="/vocabulary/japanese" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">일본어 단어장</Link>
              <Link to="/vocabulary/english" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">영어 단어장</Link>
            </div>
          </div>

          <div onClick={() => handleAddWordClick()} className="cursor-pointer text-lg font-medium text-gray-700 hover:text-indigo-600 transition duration-300">단어 추가</div>
        </nav>
      </div> {/* End of w-full max-w-6xl wrapper */}

      {/* Main content area: Dynamically rendered based on currentPage */}
      <main className="w-full flex-1 flex flex-col"> {/* Occupies remaining space and becomes a flex container */}
        <Routes>
          <Route path="/" element={
            <div className="w-full max-w-6xl mx-auto flex flex-col flex-1">
              <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full flex-1 flex flex-col items-center justify-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b-2 border-indigo-200 pb-2 text-center">
                  나만의 단어장을 만들어 보세요!
                </h2>
                <p className="text-lg text-gray-700 mb-4 text-center">
                  ASUKA 단어장 앱에서 새로운 단어를 추가하고, 학습하고, 관리해보세요.
                </p>
                <button
                  onClick={handleAddWordClick}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
                >
                  새 단어 추가하기
                </button>
              </section>
            </div>
          } />
          <Route path="/login" element={
            <section className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 flex-1">
              <AuthFormContainer
                authError={authError}
                currentUser={currentUser}
                userProfile={userProfile}
                userId={userId}
                handleLogout={handleLogout}
                handleLogin={handleLogin}
                handleGoogleSignIn={handleGoogleSignIn}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />
            </section>
          } />
          <Route path="/register" element={
            <RegisterPage
              authError={authError}
              handleRegister={handleRegister}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              username={username}
              setUsername={setUsername}
            />
          } />
          <Route path="/vocabulary/:language" element={
            <VocabularyList
              auth={auth}
              db={db}
              currentUser={currentUser}
              userId={userId}
              appId={typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}
              handleDeleteWord={handleDeleteWord}
            />
          } />
          <Route path="/add-word/:lang?" element={
            <AddWordPage
              authError={authError}
              setAuthError={setAuthError}
              word={word}
              setWord={setWord}
              meaning={meaning}
              setMeaning={setMeaning}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              handleSaveWord={handleSaveWord}
            />
          } />
          <Route path="/edit-word/:language/:wordId" element={
            <EditWordPage
              auth={auth}
              db={db}
              currentUser={currentUser}
              handleUpdateWord={handleUpdateWord}
              authError={authError}
              setAuthError={setAuthError}
            />
          } />
          <Route path="/profile" element={
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
          } />
        </Routes>
      </main>

      {/* Footer section */}
      <footer className="mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 ASUKA. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
