import {FormGroup} from '@angular/forms';
import {DureeType, TypesCalcul} from '../enums';

export function consistencyMatchValidator(group: FormGroup): any {
  if (group) {
    const typeCalcul = group.get('type_calcul').value;
    const dureeType = group.get('duree_type').value;
    const duree = group.get('duree').value;
    const duree_mois = dureeType === DureeType.ANNEE ? duree * 12 : duree;
    const capitalEmprunte = group.get('capital_emprunt').value;
    const nbEcheances = group.get('nombre_echeances').value;
    const nbEcheancesTotal = (dureeType === DureeType.MOIS ? duree / 12 : duree)
      * nbEcheances;
    const coutAssurance = (capitalEmprunte * (group.get('taux_annuel_assurance').value / 100) / nbEcheances)
      * nbEcheancesTotal;
    const mensualite = group.get('mensualite').value;
    if (typeCalcul === TypesCalcul.TAUX && mensualite !== '' &&
      mensualite * duree_mois < Number.parseFloat(capitalEmprunte) + coutAssurance) {
      return { notMatching : true };
    }
  }

  return null;
}
