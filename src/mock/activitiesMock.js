// Fechas relativas al día actual para probar Vencidas / Para hoy / Próximas
const getRelativeDates = () => {
  const d = new Date();
  const today = d.toISOString().slice(0, 10);
  d.setDate(d.getDate() - 1);
  const yesterday = d.toISOString().slice(0, 10);
  d.setDate(d.getDate() + 2);
  const tomorrow = d.toISOString().slice(0, 10);
  d.setDate(d.getDate() + 1);
  const later = d.toISOString().slice(0, 10);
  return { yesterday, today, tomorrow, later };
};

const getInitialActivities = () => {
  const { yesterday, today, tomorrow, later } = getRelativeDates();
  return [
    {
      id: '1',
      title: 'Database Systems Project Phase 2',
      course: 'CS-302',
      type: 'proyecto',
      eventDate: tomorrow,
      deadline: '11:58 PM',
      priority: 'urgent',
      milestones: [
        { text: 'Read Chapter 4 & 5', completed: true, targetDate: yesterday, estimatedEffort: 2 },
        { text: 'Design ER diagram', completed: false, targetDate: yesterday, estimatedEffort: 4 },
        { text: 'Implement queries', completed: false, targetDate: today, estimatedEffort: 3 },
        { text: 'Write project report (draft)', completed: false, targetDate: tomorrow, estimatedEffort: 5 },
        { text: 'Prepare final submission', completed: false, targetDate: later, estimatedEffort: 2 },
      ],
    },
    {
      id: '2',
      title: 'Linear Algebra Quiz Prep',
      course: 'MATH-201',
      type: 'quiz',
      eventDate: tomorrow,
      deadline: '9:00 AM',
      priority: 'medium',
      milestones: [
        { text: 'Review eigenvalues & eigenvectors', completed: false, targetDate: today, estimatedEffort: 1 },
        { text: 'Practice diagonalization problems', completed: false, targetDate: today, estimatedEffort: 4 },
        { text: 'Do 20 min timed mini-quiz', completed: false, targetDate: tomorrow, estimatedEffort: 2 },
      ],
    },
    {
      id: '3',
      title: 'Quiz Prep',
      course: 'MATH-201',
      type: 'quiz',
      eventDate: later,
      deadline: '10:00 AM',
      priority: 'medium',
      milestones: [
        { text: 'Summarize notes (1 page)', completed: false, targetDate: later, estimatedEffort: 2 },
        { text: 'Solve past quizzes', completed: false, targetDate: later, estimatedEffort: 3 },
      ],
    },
  ];
};

export const initialActivities = getInitialActivities();

export const sortByPriority = (activities) => {
  return [...activities].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
};
