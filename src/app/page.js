import Link from "next/link";
import { Racing_Sans_One, Reddit_Sans } from "next/font/google";

const redditSans = Reddit_Sans({ weight: "400", subsets: ["latin"] });
const racingSans = Racing_Sans_One({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #18181b 0%, #18181b 80%, var(--color-lyra-gray) 100%)' }}>
      <main className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <section className="min-h-[90vh] flex flex-col justify-center items-center text-center">
          <h1 className={`${racingSans.className} text-[clamp(8rem,20vw,18rem)] font-black leading-[0.9] tracking-tight bg-gradient-to-tr from-lyra-purple to-lyra-pink bg-clip-text text-transparent pb-4`}>
            lyra
          </h1>
          <div className="mt-10 max-w-2xl">
            <p className={`${redditSans.className} text-2xl md:text-2xl leading-tight text-zinc-300 font-bold`}>
              unlock the hidden meanings behind your favorite lyrics with lyra's analysis
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}