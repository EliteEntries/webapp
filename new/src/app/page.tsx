
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full font-sans bg-gray-50 p-8 pb-64">
      <Image
        className="dark:invert mb-6"
        src="/icon.png"
        alt="Elite Entries logo"
        width={180}
        height={38}
        priority
      />
      <p className="text-lg text-center max-w-xl mb-8 text-gray-800">
        Elite Entries is a trading API key aggregator and manager for the Elite Entries trading system, built on <a href="https://redbtn.io" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">redbtn</a>. Securely connect, manage, and monitor your trading API keys in one place.
      </p>
      <a
        href="/connections"
        className="mt-4 px-6 py-3 rounded-full text-white font-semibold shadow hover:opacity-90 transition-colors"
        style={{ backgroundColor: '#7289da' }}
      >
        Manage Connections
      </a>
    </div>
  );
}
