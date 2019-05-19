/*
* @Author: janko
* @Date:  16-May-2019
* @Last Modified by:   jankergg
* @Last Modified time: 2019-05-16
*/
const {updateRow} = require('./updaterow');
function api(auth, req, res, next) {
    console.log('==========', req.body)
    updateRow.apply(null, Array.prototype.slice.call(arguments))
}

exports.api = api;
