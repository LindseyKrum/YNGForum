// Fixed team of 6 attendees for Forums
export const ATTENDEES = [
  { id: 1, name: 'Maya Chen', flag: '🇺🇸' },
  { id: 2, name: 'Erik Svensson', flag: '🇸🇪' },
  { id: 3, name: 'Dimitri Papadopoulos', flag: '🇨🇾' },
  { id: 4, name: 'Marco Rossi', flag: '🇮🇹' },
  { id: 5, name: 'Petra Novotná', flag: '🇨🇿' },
  { id: 6, name: 'Amir Khan', flag: '🇵🇰' }
]

export const getAttendeeById = (id) => ATTENDEES.find(a => a.id === id)

export const getAttendeeNameById = (id) => {
  const attendee = getAttendeeById(id)
  return attendee ? attendee.name : 'Unknown'
}
