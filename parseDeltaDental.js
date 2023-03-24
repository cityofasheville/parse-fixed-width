#!/usr/bin/env node

// Parses fixed width files
// Usage: ./parseDeltaDental dd.txt dd.csv

let params = process.argv;

let fs = require("fs");

const readline = require('readline');

let widths = [6,7,9,1,6,2,1,1,8,8,9,9,9,2,8,8,1,24,24,24,1,5,30,30,30,2,3,3,5,4,21,30,1,9];


async function processLineByLine() {
  const fileStream = fs.createReadStream(params[2]);
  const fileOut = fs.createWriteStream(params[3]);

  fileOut.write("carrierId,clientID,SubCliID,SvcType,,RateCode,,EligibilityCode,EffDate,TermDate,SubscrSSN,IndivSSN,ChangeSSN,Relationship,HireDate,DOB,RelationshipType,FirstName,MiddleName,LastName,Gender,Pop,Addr1,Addr2,City,St,County,Country,Zip,ZipEx,,UserDef,WaitPeriod,ClientAlt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const aline of rl) {
    let line = aline.replace(/,/g,' ');
    let startpos = 0;
    let endpos;
    let fieldnum = 0;
    let dates = [8,9,14,15];
    widths.forEach(width=>{
      endpos = startpos + width;
      let out = line.substring(startpos,endpos) + ",";
      if (dates.includes(fieldnum) && out != "        ,") {
        out = out.substring(4,8) + "-" + out.substring(0,2) + "-" + out.substring(2,4) + ",";
      }
      fileOut.write(out);
      startpos = endpos;
      fieldnum += 1;
    });
    fileOut.write("\n");
  }
}

processLineByLine();