
"use client";
import React from "react";
import Accordian from "../../../components/Accordian";
import Connection from "./Connection";

interface KeyInfo {
  keyName: string;
  apiKey: string;
  createdAt?: string;
}

const keyDescriptions: Record<string, string> = {
  Binance: "Connect your Binance API key to aggregate your trading data.",
  Coinbase: "Connect your Coinbase API key for portfolio tracking.",
  Kraken: "Connect your Kraken API key for trade automation.",
};

type KeysProps = {
  keys: KeyInfo[];
};

const Keys: React.FC<KeysProps> = ({ keys }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {keys.length === 0 ? (
        <div className="text-muted-foreground">No API keys found.</div>
      ) : (
        keys.map((conn, idx) => (
          <Accordian
            key={conn.keyName}
            title={conn.keyName}
            open={openIndex === idx}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            styles=""
          >
            <Connection
              name={conn.keyName}
              description={keyDescriptions[conn.keyName] || "API key for " + conn.keyName}
              apiKey={conn.apiKey}
            />
          </Accordian>
        ))
      )}
    </div>
  );
};

export default Keys;
