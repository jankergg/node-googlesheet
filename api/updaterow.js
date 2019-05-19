/*
* @Author: janko
* @Date:  17-May-2019
* @Last Modified by:   jankergg
* @Last Modified time: 2019-05-17
*/

const {google} = require('googleapis');
const NumberPattrn = new RegExp("[\(\)\$\s]","ig");
const defaultSheetId = '1JFh_p0vKxkXY1MWXHblWxAntckmlvRGoqW9Blje8rOo';
let authObj = null;
function getRow(row){
    if(typeof row === 'string'){
        return JSON.parse(row);
    }
    return row;
}
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
        return res.end('null');
    }
    GetSheetRows(sheets, req.body, rows => {
        // update, append
        switch (req.body.activity) {
           case "new":
               console.log('appending: ...');
               appendRow(sheets, rows, req, res);
               break;
            case "update":
                console.log('updating: ...');
                updateRow(sheets, rows, req, res);
                break;
            default:
                break;
        }
    });
}

// update row
function updateRow(sheets, rows, req, res, next){
    let $row = getRow(req.body.row);
    let $email = $row[6];
    let matchedRowNum = null;
    let matchedRow = null;
    for(var i=0;i<rows.length;i++){
        let row = rows[i];
        if(row.indexOf($email)>-1) {
            matchedRow = row;
            matchedRowNum = i+2;
            break;
        }
    }

    console.log('0000000000000000000');
    console.log(matchedRowNum);
    console.log(matchedRow);
    console.log('0000000000000000000');
    // if not append instead
    if(matchedRow == null){
        return appendRow(sheets, rows, req, res)
    }
    // ["0","1","2","3","4","5","jankergg@gmail.com","Paid","4191920501558241170670","5/18/2019","9:46:10 PM",2,387,"ch_1EZRgkG71S92zYgAEsARtCMd"]
    matchedRow[7] = $row[7];
    matchedRow[8] = $row[8];
    matchedRow[9] = $row[9];
    matchedRow[10] = $row[10];
    matchedRow[11] = $row[11];
    matchedRow[12] = $row[12];
    const request = {
        // The spreadsheet to apply the updates to.
        spreadsheetId: req.body.sid||defaultSheetId,
        valueInputOption: "USER_ENTERED",
        range:"A" + matchedRowNum,
        resource: {
            majorDimension:"ROWS",
            values:[ matchedRow ]
        },
        auth: authObj
    };
    sheets.spreadsheets.values.update(request, function(err, response) {
        if (err) {
            console.error(err);
            return;
        }
        res.end('success');
    });
}

// append row
function appendRow(sheets, rows, req, res, next){
    const valueInputOption = "USER_ENTERED";
    const $response = res;
    let rlen = rows ? rows.length : 0;
    // add No.
    let $row = getRow(req.body.row);
    $row[0] = rlen + 1;
    const body = {
        values: [$row]
    };
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
}

exports.updateRow = function (auth, req, res, next) {
    const sheets = google.sheets({version: 'v4', auth});
    authObj = auth;
    WriteSheetRow(sheets, req, res);
    // res.end('ok...');
    // res.json('ok');
};

