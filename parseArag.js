#!/usr/bin/env node

// Parses fixed width files
// Usage: ./parseArag arag.txt arag.csv

let params = process.argv;

let fs = require("fs");

const readline = require('readline');

let widths = [ 9,20,20,30,30,25,2,9,2,8,8,1,1,12,8,8,1,8,1,20,20,8,1,20,20,8,1,20,20,8,1,20,20,8,1,50,50,10,4,10 ]


async function processLineByLine() {
  const fileStream = fs.createReadStream(params[2]);
  const fileOut = fs.createWriteStream(params[3]);

  fileOut.write(`Employee ID,Employee Last Name,Employee First Name and Initial,Employee Address Line 1,Employee Address Line 2	,Employee City,Employee State,Employee Zip Code,Coverage Code,Employee Birth Date,Employee Hire Date,Employee Gender,Employee Marital Status,Division/Location/Plan,Coverage Effective Date,Coverage Term Date,Coverage Status Code,Dependent 1 Date of Birth,Dependent 1 Relationship,Dependent 2 Last name,Dependent 2 First Name,Dependent 2 Date of Birth,Dependent 2 Relationship,Dependent 3 Last name,Dependent 3 First Name	N	ot Required,Dependent 3 Date of Birth,Dependent 3 Relationship,Dependent 4 Last name,Dependent 4 First Name	,Dependent 4 Date of Birth,Dependent 4 Relationship,Dependent 5 Last name	,Dependent 5 First Name,Dependent 5 Date of Birth,Dependent 5 Relationship,E-mail Address (Corporate),E-mail Address (Personal),Phone (Corporate),Phone Ext (Corporate),Phone (Personal)`);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const aline of rl) {
    let line = aline.replace(/,/g,' ');
    let startpos = 0;
    let endpos;
    let fieldnum = 0;
    let dates = [9,10,14,15];
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