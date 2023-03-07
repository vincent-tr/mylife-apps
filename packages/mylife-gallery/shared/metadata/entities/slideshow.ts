export default {
  id: 'slideshow',
  parent: 'base',
  name: 'Diaporama',
  fields: [
    { id: 'name', name: 'Nom', datatype: 'name', constraints: ['not-null', 'not-empty'] },
    { id: 'albums', name: 'Albums', datatype: 'list:album', constraints: ['not-null'], initial: [] },
    { id: 'order', name: 'Ordre', datatype: 'slideshow-style-order', constraints: ['not-null'], initial: 'ordered' },
    { id: 'transition', name: 'Transition', datatype: 'slideshow-style-transition', constraints: ['not-null'], initial: 'none' },
    { id: 'interval', name: 'Interval', datatype: 'real', constraints: ['not-null'], initial: 5 },
  ],
  display: obj => obj.name
};
