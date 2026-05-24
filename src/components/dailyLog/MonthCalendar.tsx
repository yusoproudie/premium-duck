import type { DailyLogEntry } from '../../types';
import { getDayStatus } from '../../utils/dailyLog';

interface MonthCalendarProps {
  currentDate: Date;
  logEntries: DailyLogEntry[];
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const MonthCalendar = ({ currentDate, logEntries, onDayClick }: MonthCalendarProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const getEntry = (day: number) =>
    logEntries.find((e) => isSameDay(new Date(e.date), new Date(year, month, day)));

  const getDayClass = (entry: DailyLogEntry | undefined, day: number): string => {
    const status = getDayStatus(entry);
    const isToday = isSameDay(new Date(year, month, day), today);
    const base = 'w-full aspect-square flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-colors cursor-pointer';

    if (isToday) return `${base} ring-2 ring-cozy-blue bg-cozy-card`;
    if (status === 'positive') return `${base} bg-cozy-yellow text-cozy-text-primary`;
    if (status === 'penalty') return `${base} bg-cozy-pink text-cozy-text-primary`;
    return `${base} bg-cozy-card text-cozy-text-primary hover:bg-cozy-border`;
  };

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-cozy-text-secondary py-1">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, idx) =>
          day === null ? (
            <div key={`empty-${idx}`} />
          ) : (
            <button
              key={day}
              className={getDayClass(getEntry(day), day)}
              onClick={() => onDayClick(new Date(year, month, day))}
            >
              <span>{day}</span>
              {getEntry(day) && (
                <span className="text-xs leading-none mt-0.5">
                  🪙{getEntry(day)!.totalCoins > 0 ? getEntry(day)!.totalCoins : getEntry(day)!.totalCoins}
                </span>
              )}
            </button>
          )
        )}
      </div>
    </div>
  );
};
