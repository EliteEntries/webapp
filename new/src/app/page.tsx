
import Image from "next/image";
import HomeButton from "./components/HomeButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-full font-sansp-8 pt-24">
      <Image
        className="dark:invert mb-6"
        src="/icon.png"
        alt="Elite Entries logo"
        width={180}
        height={38}
        priority
      />
      <p className="text-lg text-center max-w-xl mb-8">
        Elite Entries is a trading API key aggregator and manager for the Elite Entries trading system, built on <a href="https://redbtn.io" className="underline text-blue-600" target="_blank" rel="noopener noreferrer">redbtn</a>. Securely connect, manage, and monitor your trading API keys in one place.
      </p>
      <HomeButton />
    </div>
  );
}
