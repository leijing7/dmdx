/*
merge single item json and key json
ij: item json
kj: key json
*/

module.exports = (function() {

  var mergeNnItemKey = function(ij, kj) {
    var _ = require('underscore');
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

  return {
    mergeNnItemKey: mergeNnItemKey
  }

})();
