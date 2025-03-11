import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import WebVulnerabilityScanner from '../components/security/WebVulnerabilityScanner';
import CredentialManager from '../components/security/CredentialManager';
import DataEncryption from '../components/security/DataEncryption';

// URL da API definida como versão remota
const API_URL = process.env.NEXT_PUBLIC_APIS_URL_REMOTE;

export default function WelcomePage() {
  const [sessionData, setSessionData] = useState(null);
  const [activeFeature, setActiveFeature] = useState(null);
  const router = useRouter();

  // Estados para a funcionalidade de scan
  const [scanUrl, setScanUrl] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loadingScan, setLoadingScan] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/auth');
      } else {
        setSessionData(JSON.parse(user));
      }
    };

    checkSession();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth');
  };

  // Função para realizar o scan do site
  const handleScan = async () => {
    if (!scanUrl) return alert("Digite uma URL válida!");
    setLoadingScan(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/scan`, { url: scanUrl });
      setScanResult(data);
    } catch (error) {
      console.error("Erro ao fazer scan:", error);
      alert("Houve um erro ao analisar a URL.");
    } finally {
      setLoadingScan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Painel de Controle CiberShield</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Sair
          </button>
        </div>

        {sessionData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => setActiveFeature('encryption')}
              className="cursor-pointer p-6 bg-blue-600 text-white rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold">Encriptação de Dados</h2>
              <p>Encripte dados sensíveis antes de enviá-los.</p>
            </div>

            <div 
              onClick={() => setActiveFeature('scanner')}
              className="cursor-pointer p-6 bg-green-600 text-white rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold">Scanner de Vulnerabilidades Web</h2>
              <p>Identifique vulnerabilidades em sua aplicação web.</p>
            </div>

            <div 
              onClick={() => setActiveFeature('credentials')}
              className="cursor-pointer p-6 bg-purple-600 text-white rounded-lg shadow-md"
            >
              <h2 className="text-xl font-bold">Gerenciador de Credenciais Seguras</h2>
              <p>Gerencie suas credenciais de forma segura.</p>
            </div>
          </div>
        )}

        {activeFeature === 'encryption' && <DataEncryption />}
        {activeFeature === 'scanner' && <WebVulnerabilityScanner />}
        {activeFeature === 'credentials' && <CredentialManager />}
      </div>
    </div>
  );
}
