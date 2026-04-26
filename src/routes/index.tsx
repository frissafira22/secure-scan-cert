import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, QrCode, Hash, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CertChain — Sertifikat Digital Anti Palsu" },
      {
        name: "description",
        content:
          "Bangun sertifikat dengan hash SHA-256, QR code verifikasi, dan ekspor PDF instan.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-28 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-primary">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Powered by SHA-256
          </div>

          <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Sertifikat Digital
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow">
              Anti Palsu
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Setiap sertifikat di-sign dengan hash kriptografis SHA-256.
            Sekali ubah satu huruf, hash berubah total — jadi keaslian bisa
            dibuktikan dalam hitungan detik.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 font-semibold glow-cyan">
              <Link to="/generate">
                Buat Sertifikat <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-primary/40 bg-background/50 px-6 font-semibold backdrop-blur"
            >
              <Link to="/verify">Cek Sertifikat</Link>
            </Button>
          </div>

          {/* Hash demo */}
          <div className="mx-auto mt-16 max-w-2xl rounded-xl border border-border/60 bg-card/50 p-5 text-left backdrop-blur">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <Hash className="h-3 w-3" /> Sample Output
            </div>
            <div className="mt-3 font-mono text-xs">
              <div className="text-muted-foreground">
                input ={" "}
                <span className="text-foreground">
                  "Friska|Seminar AI|2026"
                </span>
              </div>
              <div className="mt-1 text-muted-foreground">
                sha256 ={" "}
                <span className="break-all text-primary">
                  a8f5f167f44f4964e6c998dee827110c4a6b7d2f8e91a3b4c5d6e7f8901a2b3c
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-3">
          <FeatureCard
            icon={<Hash className="h-5 w-5" />}
            title="Hash SHA-256"
            desc="Setiap sertifikat dikunci dengan hash 64 karakter. Tidak bisa dipalsukan tanpa terdeteksi."
          />
          <FeatureCard
            icon={<QrCode className="h-5 w-5" />}
            title="QR Code Instan"
            desc="QR code menempel di sertifikat. Scan langsung verifikasi keaslian."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Verifikasi Publik"
            desc="Siapa pun bisa cek sertifikat hanya dengan hash atau scan QR."
          />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
            Cara Kerja
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
            Tiga langkah, selesai
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Isi Data",
              d: "Nama, kegiatan, dan tanggal. Sistem gabungkan jadi satu payload.",
            },
            {
              n: "02",
              t: "Generate Hash",
              d: "SHA-256 menghasilkan signature unik 64 karakter & QR code.",
            },
            {
              n: "03",
              t: "Verifikasi",
              d: "Hash disimpan ke database. Cocokkan saat ada yang ingin verifikasi.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-border/60 bg-card p-6"
            >
              <div className="font-mono text-3xl font-bold text-primary/40">
                {s.n}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button asChild size="lg" className="h-12 px-8 glow-cyan">
            <Link to="/generate">
              <Sparkles className="mr-2 h-4 w-4" /> Mulai sekarang
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border/50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center font-mono text-xs text-muted-foreground">
          CertChain · SHA-256 Verified · Built on Lovable Cloud
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-xl border border-border/60 bg-card/60 p-6 transition hover:border-primary/40 hover:bg-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}