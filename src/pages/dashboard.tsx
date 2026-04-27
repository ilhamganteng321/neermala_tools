import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PenLine,
  FileText,
  MoveRight,
  Layers,
  BookOpen,
  File,
} from "lucide-react";

const TOOLS = [
  {
    title: "Digital Signature",
    description:
      "Buat tanda tangan dengan menggambar manual atau mengetik nama dengan font estetik.",
    icon: <PenLine className="w-6 h-6 text-blue-500" />,
    path: "/signature",
    status: "Ready",
    color: "hover:border-blue-500/50 hover:bg-blue-50/30",
  },
  {
    title: "Code to Image",
    description:
      "Ubah potongan kode programming menjadi gambar cantik untuk dibagikan.",
    icon: <Layers className="w-6 h-6 text-purple-500" />,
    path: "/code-to-image",
    status: "Ready",
    color: "hover:border-purple-500/50 hover:bg-purple-50/30",
  },
  {
    title: "JSON Formatter & Viewer",
    description: "Format dan tampilkan data JSON dengan mudah.",
    icon: <File className="w-6 h-6 text-red-500" />,
    path: "/json-formater",
    status: "Ready",
    color: "hover:border-red-500/50 hover:bg-red-50/30",
  },
  {
    title: "Read the Quran",
    description: "Baca Al-Qur'an secara digital.",
    icon: <BookOpen className="w-6 h-6 text-green-500" />,
    path: "/quran",
    status: "Ready",
    color: "hover:border-green-500/50 hover:bg-green-50/30",
  },
  {
    title: "PDF Watermark",
    description:
      "Tambahkan teks atau logo watermark ke dokumen PDF Anda secara instan.",
    icon: <FileText className="w-6 h-6 text-orange-500" />,
    path: "/watermark",
    status: "Coming Soon",
    color: "opacity-70 grayscale cursor-not-allowed",
  },
];

export const Dashboard = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Smart <span className="text-primary">Utility</span> Tools
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Kumpulan alat bantu produktivitas gratis untuk mempermudah pekerjaan
          digital Anda. Semua diproses langsung di browser, aman dan cepat.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOOLS.map((tool, index) => (
          <div key={index} className="relative group">
            <Card
              className={`h-full transition-all duration-300 border-2 ${tool.color}`}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-white rounded-lg shadow-sm border group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <Badge
                    variant={tool.status === "Ready" ? "default" : "secondary"}
                  >
                    {tool.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {tool.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {tool.status === "Ready" ? (
                  <button className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:translate-x-2 transition-transform">
                    Buka Alat <MoveRight className="w-4 h-4" />
                  </button>
                ) : (
                  <span className="text-sm font-medium text-muted-foreground">
                    Segera Hadir
                  </span>
                )}
              </CardContent>
            </Card>

            {/* Link Overlay hanya aktif jika status Ready */}
            {tool.status === "Ready" && (
              <a href={tool.path} className="absolute inset-0 z-10" />
            )}
          </div>
        ))}
      </div>

      <footer className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
        <div className="flex justify-center gap-4 mb-4">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500" /> Private
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500" /> Secure
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500" /> Fast
          </span>
        </div>
        &copy; 2026 Ilham Arip - Build with React & Tailwind
      </footer>
    </div>
  );
};
