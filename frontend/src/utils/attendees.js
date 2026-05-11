// Fixed team of 6 attendees for Forums
export const ATTENDEES = [
  {
    id: 1,
    name: 'Maya Chen',
    flag: '🇺🇸',
    phones: ['+1 562 714 2493', '+1 406 670 1596', '+44 07709 250 215'],
    birthday: 'October 10'
  },
  {
    id: 2,
    name: 'Erik Svensson',
    flag: '🇨🇿🇸🇪',
    phones: ['+420 775 400 000'],
    birthday: 'April 25'
  },
  {
    id: 3,
    name: 'Dimitri Papadopoulos',
    flag: '🇨🇾',
    phones: ['+1 424 385 2068'],
    birthday: 'January 4'
  },
  {
    id: 4,
    name: 'Marco Rossi',
    flag: '🇮🇹',
    phones: ['+39 366 3269242'],
    birthday: 'May 4'
  },
  {
    id: 5,
    name: 'Petra Novotná',
    flag: '🇨🇿',
    phones: ['+420 736 477 753'],
    birthday: 'January 15'
  },
  {
    id: 6,
    name: 'Amir Khan',
    flag: '🇬🇧',
    phones: ['+1 302 249 2687'],
    birthday: 'March 18'
  }
]

export const getAttendeeById = (id) => ATTENDEES.find(a => a.id === id)

export const getAttendeeNameById = (id) => {
  const attendee = getAttendeeById(id)
  return attendee ? attendee.name : 'Unknown'
}
