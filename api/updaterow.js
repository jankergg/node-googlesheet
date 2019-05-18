/*
* @Author: janko
* @Date:  17-May-2019
* @Last Modified by:   jankergg
* @Last Modified time: 2019-05-17
*/

const {google} = require('googleapis');
const NumberPattrn = new RegExp("[\(\)\$\s]","ig");
const defaultSheetId = '1JFh_p0vKxkXY1MWXHblWxAntckmlvRGoqW9Blje8rOo';

function GetSheetRows(sheets, options = {}, callback){
    sheets.spreadsheets.values.get({
        spreadsheetId: options.sid || defaultSheetId,
        range: 'A2:L',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        callback(res.data.values);
    });
}

function WriteSheetRow(sheets, req, res){
    if(!req.body.row || !req.body.row.length){
        return;
    }

    const $response = res;
    const valueInputOption = "USER_ENTERED";
    console.log('writing: test');
    GetSheetRows(sheets, req.body, rows => {
        let rlen = rows ? rows.length : 0;
        // add No.
        let $row = req.body.row;
        $row[0] = rlen + 1;
        const body = {
            values: [$row]
        };
        // update, append
        sheets.spreadsheets.values.append({
                spreadsheetId: req.body.sid|| defaultSheetId,
                range: 'A2:F',
                valueInputOption: valueInputOption,
                resource: body
            }, (err, res) => {
                if( res.status === 200){
                    $response.end('success');
                } else {
                    console.log('update failed!');
                }
            }
        )
    });
}

exports.updateRow = function (auth, req, res, next) {
    const sheets = google.sheets({version: 'v4', auth});
    WriteSheetRow(sheets, req, res);
    // res.end('ok...');
    // res.json('ok');
};

