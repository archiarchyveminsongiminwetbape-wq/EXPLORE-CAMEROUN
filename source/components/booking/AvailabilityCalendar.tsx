import { useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { fr } from 'date-fns/locale/fr';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'fr-FR': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface AvailabilityCalendarProps {
  onSelectSlot: (slotInfo: { start: Date; end: Date }) => void;
  bookings: Array<{ start: Date; end: Date }>;
}

export function AvailabilityCalendar({ onSelectSlot, bookings }: AvailabilityCalendarProps) {
  const handleSelectSlot = useCallback((slotInfo: { start: Date; end: Date }) => {
    onSelectSlot({
      start: slotInfo.start,
      end: slotInfo.end,
    });
  }, [onSelectSlot]);

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={bookings}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={['month', 'week', 'day']}
        onSelectSlot={handleSelectSlot}
        selectable
        style={{ height: '100%' }}
        messages={{
          today: "Aujourd'hui",
          previous: 'Précédent',
          next: 'Suivant',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#f56565',
            borderRadius: '4px',
            color: 'white',
            border: '0px',
          },
        })}
      />
    </div>
  );
}
