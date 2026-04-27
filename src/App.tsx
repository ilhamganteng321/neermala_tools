import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "@/App.css";
import { ModeToggle } from "@/components/mode-toggle";
import SignaturePage from "@/pages/signature-page";
import { Dashboard } from "@/pages/dashboard";
import CodeToImage from "@/pages/code-to-image";
import { Code2 } from "lucide-react";
import QuranList from "@/pages/quran";
import SurahReader from "@/components/quran/quran-read";
import JsonFormatter from "@/pages/json-formater";
import ReportExcelPage from "@/pages/report-excel";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/")}
      className="fixed top-4 left-4 z-50 flex hover:cursor-pointer items-center gap-2 hover:opacity-80 transition-opacity"
    >
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
        <Code2 className="w-4 h-4 text-primary-foreground" />
      </div>
      <span className="font-semibold text-foreground text-sm">
        Neermala Tools
      </span>
    </button>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-background">
      <BrowserRouter>
        <Logo />
        <div className="fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/signature" element={<SignaturePage />} />
          <Route path="/code-to-image" element={<CodeToImage />} />
          <Route path="/quran" element={<QuranList />} />
          <Route path="/surah/:noSurat" element={<SurahReader />} />
          <Route path="/json-formater" element={<JsonFormatter />} />
          <Route path="/report-excel" element={<ReportExcelPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
