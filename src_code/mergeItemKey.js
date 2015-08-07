/*
merge single item json and key json
ij: item json
kj: key json
*/

module.exports = (function() {
  var _ = require('underscore');

  var mergeNnnItemKey = function(ij, kj) {
    var itemKeyJson = _.extend(ij, kj);
    delete itemKeyJson['Item No.'];
    delete itemKeyJson['Stimulus type'];

    var opposite = {
      'Same': 'Different',
      'Different': 'Same'
    };

    itemKeyJson['Participant response'] = itemKeyJson['Accuracy'] ? itemKeyJson['Target response'] : opposite[itemKeyJson['Target response']];

    switch (itemKeyJson['Target response'] + '-' + itemKeyJson['Participant response']) {
      case 'Same-Same':
        itemKeyJson['Response type'] = 'CR';
        break;
      case 'Same-Different':
        itemKeyJson['Response type'] = 'False+';
        break;
      case 'Different-Same':
        itemKeyJson['Response type'] = 'Miss';
        break;
      case 'Different-Different':
        itemKeyJson['Response type'] = 'Hit';
        break;
      default:
        throw ('Wrong Participant response and Target response combination');
    }

    return itemKeyJson;
  };

  /*
  /////////////////////////////////////////////////////////////////////////////
  isCorrect: participant pressed btn from .zil with Expected btn collumn (same: 1; not 0)
  condition: AO:
  Response - Auditory: isCorrect
  Response - Visual:   -1
  Response - Fused:    -1
  Response descriptor: check the Auditory collumn {1: Correct, 0: Incorrect}
  /////////////////////////////////////////////////////////////////////////////
  condition: VO:
  Response - Auditory: -1
  Response - Visual:   isCorrect
  Response - Fused:    opposite to the Visual collumn {1: 0, 0:1}
  Response descriptor: check the Visual collumn   {1: Correct, 0: Incorrect}
  /////////////////////////////////////////////////////////////////////////////
  condition: AV_C:
  Response - Auditory: isCorrect
  Response - Visual:   isCorrect
  Response - Fused:    -1
  Response descriptor: check the Auditory or Visual collumn {1: Correct, 0: Incorrect}
  /////////////////////////////////////////////////////////////////////////////
  condition: AV_M:
  Response - Auditory: -2
  Response - Visual:   -2
  Response - Fused:    -2
  Response descriptor: 'Ella to fill'
  */

  var mergeMcItemKey = function(ij, kj) {
    var itemKeyJson = _.extend(ij, kj);

    delete itemKeyJson['Item No.'];
    delete itemKeyJson['File name'];
    delete itemKeyJson['Speaker Gender'];
    delete itemKeyJson['Stimulus'];
    delete itemKeyJson['Audio component'];
    delete itemKeyJson['Video component'];
    delete itemKeyJson['Expected button'];
    delete itemKeyJson['Expected syllable'];
    delete itemKeyJson['Response type'];
    delete itemKeyJson['Genre'];

    itemKeyJson['Participant response'] = ij['Participant btn num'];
    var isCorrect = (ij['Participant btn num'] === kj['Expected button']) ? 1 : 0;
    switch (kj['Condition']) {
      case 'AO':
        itemKeyJson['Response - Auditory'] = isCorrect;
        itemKeyJson['Response - Visual'] = -1;
        itemKeyJson['Response - Fused'] = -1;
        itemKeyJson['Response descriptor'] = itemKeyJson['Response - Auditory'] ? 'Correct' : 'Incorrect';
        break;
      case 'VO':
        itemKeyJson['Response - Auditory'] = -1;
        itemKeyJson['Response - Visual'] = isCorrect;
        itemKeyJson['Response - Fused'] = itemKeyJson['Response - Visual'] ? 0 : 1;
        itemKeyJson['Response descriptor'] = itemKeyJson['Response - Visual'] ? 'Correct' : 'Incorrect';
        break;
      case 'AV_C':
        itemKeyJson['Response - Auditory'] = isCorrect;
        itemKeyJson['Response - Visual'] = isCorrect;
        itemKeyJson['Response - Fused'] = -1;
        itemKeyJson['Response descriptor'] = itemKeyJson['Response - Auditory'] ? 'Correct' : 'Incorrect';
        break;
      case 'AV_M':
        itemKeyJson['Response - Auditory'] = -2;
        itemKeyJson['Response - Visual'] = -2;
        itemKeyJson['Response - Fused'] = -2;
        itemKeyJson['Response descriptor'] = 'Ella to fill';
        break;
      default:
        console.log('Parse AVFd cols error.');
        process.exit(0);
    }
    return itemKeyJson;
  };

  //ij: itemJson;
  //kj: keyJson
  function merge(kj, ij, expType) {
    switch (expType) {
      case 'N-NN':
        return mergeNnnItemKey(kj, ij);
      case 'McGurk':
        return mergeMcItemKey(kj, ij);
      default:
        throw('Experiment type input error. Should be "N-NN" or "McGurk". ');
    }
  }

  return {
    merge:merge
  };

})();
