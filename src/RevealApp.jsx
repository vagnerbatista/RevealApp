import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import Countdown from "react-countdown";
import boy from "../src/assets/Boy.svg";
import girl from "../src/assets/Girl.svg";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const RevealApp = () => {
  const [vote, setVote] = useState(null);
  const [votes, setVotes] = useState({ boy: 0, girl: 0 });
  const revealTime = new Date();
  revealTime.setHours(16, 0, 0, 0);

  // Função para buscar votos
  const fetchVotes = async () => {
    const querySnapshot = await getDocs(collection(db, "votes"));
    let boyVotes = 0;
    let girlVotes = 0;
    querySnapshot.forEach((doc) => {
      if (doc.data().vote === "boy") boyVotes++;
      if (doc.data().vote === "girl") girlVotes++;
    });
    setVotes({ boy: boyVotes, girl: girlVotes });
  };

  useEffect(() => {
    fetchVotes(); // Busca os votos ao carregar o componente
  }, []);

  const handleVote = async (gender) => {
    // Adiciona o voto ao Firestore
    await addDoc(collection(db, "votes"), { vote: gender });

    // Atualiza o estado local
    setVote(gender);

    // Atualiza a quantidade de votos localmente
    setVotes((prev) => ({ ...prev, [gender]: prev[gender] + 1 }));

    // Busca os votos novamente para garantir que os dados estejam atualizados do Firestore
    fetchVotes();
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 p-4">
      <h1 className="text-2xl font-bold mb-4" style={{ fontSize: 70, color: "#da5162" }}>
        Chá Revelação
      </h1>
      {new Date() < revealTime ? (
        <>
          <h3 className="text-center" style={{ fontSize: 40, color: "#17a2b8" }}>
            Revelação em:
            <br />
            <Countdown date={revealTime} />
          </h3>
          {!vote && (
            <div className="row mt-5 justify-content-center w-75">
              {/* Card para o botão "Menino" */}
              <div className="col-md-4 mb-4 d-flex justify-content-center">
                <div className="card text-center">
                  <div
                    className="card-body rounded"
                    style={{ backgroundColor: "#057ee6" }}
                  >
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleVote("boy")}
                    >
                      <img src={boy} className="card-img-top" alt="Menino" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card para o botão "Menina" */}
              <div className="col-md-4 mb-4 d-flex justify-content-center">
                <div className="card text-center">
                  <div
                    className="card-body rounded"
                    style={{ backgroundColor: "#da5162" }}
                  >
                    <button
                      type="button"
                      className="btn"
                      onClick={() => handleVote("girl")}
                    >
                      <img src={girl} className="card-img-top" alt="Menina" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {vote && (
            <p className="mt-4 text-center" style={{ fontSize: 50 }}>
              Votos: <br />
              <span style={{ color: "#057ee6" }}>Menino {votes.boy}</span>{" "}
              <br />
              <span style={{ color: "#da5162" }}>Menina {votes.girl}</span>
            </p>
          )}
        </>
      ) : (
        <h2 className="text-3xl font-bold mt-4 text-center" style={{fontSize: 70}}>
          <span
            style={{ color: votes.boy > votes.girl ? "#057ee6" : "#da5162" }}
          >
            {"Oi pessoal, eu sou uma Menina 🎀"}
          </span>
        </h2>
      )}
    </div>
  );
};

export default RevealApp;
