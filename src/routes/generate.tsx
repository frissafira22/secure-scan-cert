import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Copy, Download, Loader2, Sparkles, Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Certificate } from "@/components/Certificate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { sha256, buildPayload } from "@/lib/hash";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Generate Sertifikat — CertChain" },
      {
        name: "description",
        content: "Buat sertifikat digital baru dengan hash SHA-256 dan QR code.",
      },
    ],
  }),
  component: GeneratePage,
});

function GeneratePage() {
  const [nama, setNama] = useState("");
  const [kegiatan, setKegiatan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    nama: string;
    kegiatan: string;
    tanggal: string;
    hash: string;
    qrDataUrl: string;
  } | null>(null);

  const certRef = useRef<HTMLDivElement>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim() || !kegiatan.trim() || !tanggal.trim()) {
      toast.error("Semua field wajib diisi");
      return;
    }
    setLoading(true);
    try {
      const payload = buildPayload(nama, kegiatan, tanggal);
      const hash = await sha256(payload);

      const verifyUrl = `${window.location.origin}/verify?hash=${hash}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        margin: 1,
        width: 256,
        color: { dark: "#0a0e1a", light: "#ffffff" },
      });

      // Simpan ke database (idempotent jika hash sama)
      const { error } = await supabase.from("certificates").insert({
        nama: nama.trim(),
        kegiatan: kegiatan.trim(),
        tanggal: tanggal.trim(),
        hash,
      });

      if (error && !error.message.includes("duplicate")) {
        throw error;
      }

      setResult({
        nama: nama.trim(),
        kegiatan: kegiatan.trim(),
        tanggal: tanggal.trim(),
        hash,
        qrDataUrl,
      });
      toast.success("Sertifikat berhasil dibuat & disimpan");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat sertifikat");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!certRef.current || !result) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, (pdf.internal.pageSize.getHeight() - h) / 2, w, h);
      pdf.save(`sertifikat-${result.nama.replace(/\s+/g, "-")}.pdf`);
      toast.success("PDF berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengunduh PDF");
    } finally {
      setDownloading(false);
    }
  }

  function copyHash() {
    if (!result) return;
    navigator.clipboard.writeText(result.hash);
    setCopied(true);
    toast.success("Hash disalin");
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Generate
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Buat Sertifikat Baru
          </h1>
          <p className="mt-2 text-muted-foreground">
            Isi data di bawah. Hash SHA-256 & QR code akan dibuat otomatis.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Form */}
          <form
            onSubmit={handleGenerate}
            className="h-fit rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur"
          >
            <h2 className="mb-5 flex items-center gap-2 font-semibold">
              <Sparkles className="h-4 w-4 text-primary" />
              Data Sertifikat
            </h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="nama">Nama Peserta</Label>
                <Input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Friska Nuraini"
                  maxLength={100}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="kegiatan">Judul Kegiatan</Label>
                <Input
                  id="kegiatan"
                  value={kegiatan}
                  onChange={(e) => setKegiatan(e.target.value)}
                  placeholder="Seminar AI & Web3 2026"
                  maxLength={150}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="tanggal">Tanggal</Label>
                <Input
                  id="tanggal"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  placeholder="15 Maret 2026"
                  maxLength={50}
                  className="mt-1.5"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-6 w-full h-11 font-semibold glow-cyan"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                </>
              ) : (
                <>Generate Sertifikat</>
              )}
            </Button>

            {result && (
              <div className="mt-6 space-y-3 border-t border-border/60 pt-5">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">
                    Hash
                  </Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <code className="flex-1 break-all rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-[10px]">
                      {result.hash}
                    </code>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={copyHash}
                      className="shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-accent" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  variant="outline"
                  className="w-full h-11 border-primary/40"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat PDF…
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>

          {/* Preview */}
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Preview
            </p>
            <Certificate
              ref={certRef}
              nama={result?.nama || nama || "Nama Peserta"}
              kegiatan={result?.kegiatan || kegiatan || "Judul Kegiatan"}
              tanggal={result?.tanggal || tanggal || "Tanggal"}
              hash={
                result?.hash ||
                "0000000000000000000000000000000000000000000000000000000000000000"
              }
              qrDataUrl={result?.qrDataUrl}
            />
          </div>
        </div>
      </main>
    </div>
  );
}