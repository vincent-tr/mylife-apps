'use strict';

export const groupBy = [
  { id: 'day', text: 'Jour' },
  { id: 'month', text: 'Mois' },
  { id: 'year', text: 'Année' },
  { id: 'day-hour', text: 'Heure de la journée' },
  { id: 'week-day', text: 'Jour de la semaine' },
];

export const aggregation = [
  { id: 'count', text: 'Nombre de prises de position' },
  { id: 'sum', text: 'Profits et pertes cumulés' },
  { id: 'average', text: 'Profits et pertes moyens par position' },
  { id: 'sumMax', text: 'Niveau maxium atteint' },
  { id: 'sumMin', text: 'Niveau minimum atteint' },
];

export const chartType = [
  { id: 'line-chart', text: 'Line Chart' },
  { id: 'bar-chart', text: 'Bar Chart' },
];
