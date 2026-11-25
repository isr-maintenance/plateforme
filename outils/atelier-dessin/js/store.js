/* L'atelier est autonome : une seule « matière », sans contenu à charger. */
const DESSIN = { id: 'dessin', nom: 'Dessin technique', couleur: '#1d5fd1' };
export const matiere = (id) => (id === 'dessin' ? DESSIN : null);
