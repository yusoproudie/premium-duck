interface CoinCounterProps {
  coins: number;
}

export const CoinCounter = ({ coins }: CoinCounterProps) => {
  const isNegative = coins < 0;

  return (
    <div className="flex flex-col items-center">
      <span className={`text-2xl font-bold ${isNegative ? 'text-red-500' : 'text-cozy-yellow'}`}>
        {coins}
      </span>
      <span className="text-xs text-cozy-text-secondary">coins</span>
    </div>
  );
};
