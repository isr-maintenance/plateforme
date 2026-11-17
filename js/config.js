/* =========================================================
   CONFIGURATION — à remplir après les déploiements Apps Script
   Si API_URL est vide, l'app tourne en MODE TEST LOCAL :
   tout reste dans ce navigateur, rien n'est envoyé nulle part.
   ========================================================= */
const CONFIG = {
  LOGIN_URL: 'https://script.google.com/a/macros/elmarche.be/s/AKfycbyRQqqe47ifM319FcixJKdrAVo1vE3VFJNUKsTQiv8hX_rjYpAliY5714VXtxkOgzHuNQ/exec',   // URL « /exec » du déploiement Connexion
  API_URL:   'https://script.google.com/macros/s/AKfycbxPDMqJni1QwgLjrAV3RBmTDXeAX1MWN47cAis_I3V0VckDQEx4eq8oDxK-upmSAWX1Pw/exec',   // déploiement Données
  PDF_ELEC4: 'https://drive.google.com/file/d/1QbbCTrHYv-l8N_PEeKn7Xe5yTZP2o_bV/view',        // version élèves, SANS corrigés ni évaluations formatives (lecture : tout elmarche.be)
  PDF_ELEC4_PROF: 'https://drive.google.com/file/d/1V9WnHxwNh3s3ZjSIhthrRC1mkZIClASv/view',   // version prof AVEC corrigés (Drive : partagée seulement avec les profs)
  PDF_ELEC4_EVAL: 'https://drive.google.com/file/d/177o8D8ta8BOtdRh7HdD7gs5J0eu8XBmN/view',   // évaluations formatives (annexe H) à imprimer — profs uniquement
  ECOLE:     'Institut Saint-Roch · Marche'
};
