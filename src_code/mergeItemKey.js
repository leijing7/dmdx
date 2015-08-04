/*
merge single item json and key json
ij: item json
kj: key json
*/

module.exports = (function() {
  var _ = require('underscore');
  var mergeNnItemKey = function(ij, kj) {
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
        break;
    }

    return itemKeyJson;
  }

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

    itemKeyJson['Participant response'] = kj['Expected syllable'];

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

    var isCorrect = ij['Participant btn num'] === kj['Condition'] ? 1 : 0;
    switch (kj['Condition']) {
      case 'AO':
        itemKeyJson['Response - Auditory'] = isCorrect;
        itemKeyJson['Response - Vilsual'] = -1;
        itemKeyJson['Response - Fused'] = -1;
        itemKeyJson['Response descriptor'] = itemKeyJson['Response - Auditory'] ? 'Correct' : 'Incorrect';
        break;
      case 'VO':
        itemKeyJson['Response - Auditory'] = -1;
        itemKeyJson['Response - Vilsual'] = isCorrect;
        itemKeyJson['Response - Fused'] = itemKeyJson['Response - Vilsual'] ? 0 : 1;
        itemKeyJson['Response descriptor'] = itemKeyJson['Response - Vilsual'] ? 'Correct' : 'Incorrect';
        break;
      case 'AV_C':
        itemKeyJson['Response - Auditory'] = isCorrect;
        itemKeyJson['Response - Vilsual'] = isCorrect;
        itemKeyJson['Response - Fused'] = -1;
        itemKeyJson['Response descriptor'] = itemKeyJson['Response - Auditory'] ? 'Correct' : 'Incorrect';
        break;
      case 'AV_M':
        itemKeyJson['Response - Auditory'] = -2;
        itemKeyJson['Response - Vilsual'] = -2;
        itemKeyJson['Response - Fused'] = -2;
        itemKeyJson['Response descriptor'] = 'Ella to fill';
        break;
      default:
        console.log("Parse AVFd cols error.");
        process.exit(0);
    }

    return itemKeyJson;
  }

  return {
    mergeNnItemKey: mergeNnItemKey,
    mergeMcItemKey: mergeMcItemKey
  }

})();
