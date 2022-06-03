import {MethodesEvaluationTauxRendement, NatureBail, TypesDemembrement} from '../../../shared/enums';
import {RadioInputModel} from '../../../shared/components/stepper/inputs/radio-input/radio-input-model';

export class UsufruitInputsModel {
  private _radioInputsModelNatureBail: RadioInputModel[];
  private _radioInputsModelMethodeEvalation: RadioInputModel[];
  private _radioInputsModelTypeDemembrement: RadioInputModel[];
  private _isTabletOrMobile: boolean;
  get radioInputsModelNatureBail() {
    this._radioInputsModelNatureBail = [];
    this._radioInputsModelNatureBail.push(
      new RadioInputModel('usufruit.step1.civil', 'nature_bail'
        , NatureBail.CIVIL, 'ic_answer_civil'),
      new RadioInputModel('usufruit.step1.commercial', 'nature_bail'
        , NatureBail.COMMERCIAL, 'ic_answer_commercial'));
    return this._radioInputsModelNatureBail;
  }
  get radioInputsModelMethodeEvalation() {
    this._radioInputsModelMethodeEvalation = [];
    this._radioInputsModelMethodeEvalation.push(
      new RadioInputModel(!this._isTabletOrMobile ? 'usufruit.step2.achevement' : 'usufruit.step2.achevement_cesure',
        'methode_evaluation_taux_rendement'
        , MethodesEvaluationTauxRendement.ACHEVEMENT, 'ic_answer_end'),
      new RadioInputModel(!this._isTabletOrMobile ? 'usufruit.step2.jour' : 'usufruit.step2.jour_cesure',
        'methode_evaluation_taux_rendement'
        , MethodesEvaluationTauxRendement.JOUR, 'ic_answer_date'));
    return this._radioInputsModelMethodeEvalation;
  }
  get radioInputsModelTypeDemembrement() {
    this._radioInputsModelTypeDemembrement = [];
    this._radioInputsModelTypeDemembrement.push(
    new RadioInputModel('usufruit.step1.viager', 'type_demembrement'
      , TypesDemembrement.VIAGER, 'ic_answer_viager'),
    new RadioInputModel('usufruit.step1.temporaire', 'type_demembrement'
      , TypesDemembrement.TEMPORAIRE, 'ic_answer_temporary'));
    return this._radioInputsModelTypeDemembrement;
  }
  set isTabletOrMobile(value) {
    this._isTabletOrMobile = value;
  }
}
