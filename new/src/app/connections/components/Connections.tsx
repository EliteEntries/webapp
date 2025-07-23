'use client';

import React, { useState } from "react";
import Accordian from "../../../components/Accordian";
import Connection from "./Connection";

const connections = [
  {
    name: "Binance",
    description: "Connect your Binance API key to aggregate your trading data.",
    apiKey: "sk-xxxx-xxxx-xxxx",
  },
  {
    name: "Coinbase",
    description: "Connect your Coinbase API key for portfolio tracking.",
    apiKey: "sk-xxxx-xxxx-xxxx",
  },
  {
    name: "Kraken",
    description: "Connect your Kraken API key for trade automation.",
    apiKey: "sk-xxxx-xxxx-xxxx",
  },
];

const Connections: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {connections.map((conn, idx) => (
        <Accordian
          key={conn.name}
          title={conn.name}
          open={openIndex === idx}
          onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          styles=""
        >
          <Connection name={conn.name} description={conn.description} apiKey={conn.apiKey} />
        </Accordian>
      ))}
    </div>
  );
};

export default Connections;
