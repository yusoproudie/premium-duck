import { useState } from 'react';
import type { DailyLogEntry, DailyTask } from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { MonthNavigator } from '../components/dailyLog/MonthNavigator';
import { MonthCalendar } from '../components/dailyLog/MonthCalendar';
import { DailyLogModal } from '../components/dailyLog/DailyLogModal';
import { calculateDayCoins } from '../utils/dailyLog';

const DailyLog = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [logEntries, setLogEntries] = useState<DailyLogEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handlePrevious = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const getTasksForDate = (date: Date): DailyTask[] => {
    const entry = logEntries.find(
      (e) =>
        new Date(e.date).toDateString() === date.toDateString()
    );
    return entry?.tasks ?? [];
  };

  const handleSaveTasks = (date: Date, tasks: DailyTask[]) => {
    const totalCoins = calculateDayCoins(tasks);
    const hasPenalty = tasks.length === 0;

    setLogEntries((prev) => {
      const existing = prev.findIndex(
        (e) => new Date(e.date).toDateString() === date.toDateString()
      );
      const entry: DailyLogEntry = {
        id: existing >= 0 ? prev[existing].id : crypto.randomUUID(),
        date,
        tasks,
        totalCoins,
        hasPenalty,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = entry;
        return updated;
      }
      return [...prev, entry];
    });
  };

  return (
    <div>
      <PageHeader title="Daily Log" subtitle="Log your daily activities" />
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-cozy-card rounded-2xl border-2 border-cozy-border p-6">
          <MonthNavigator
            currentDate={currentDate}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          <MonthCalendar
            currentDate={currentDate}
            logEntries={logEntries}
            onDayClick={(date) => setSelectedDate(date)}
          />
        </div>
      </div>

      {selectedDate && (
        <DailyLogModal
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          selectedDate={selectedDate}
          tasks={getTasksForDate(selectedDate)}
          onSaveTasks={handleSaveTasks}
        />
      )}
    </div>
  );
};

export default DailyLog;
