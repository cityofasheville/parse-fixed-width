#!/usr/bin/env node

// Parses fixed width files
// Usage: ./parseCigna XO16000.txt cigna.csv

let params = process.argv;

let fs = require("fs");

const readline = require('readline');

let widths = [2,1,9,1,30,15,1,3,8,1,9,1,9,1,10,10,4,30,30,20,2,9,9,1,2,1,8,1,1,8,1,9,1,8,8,1,8,8,50,9,1,1,12,1,2,1,8,8,1,2,15,1,2,1,8,8,1,2,15,1,2,1,8,8,1,2,15,33,1,8,9,20,61,7,6,5,8,8,1,1,1,1,1,8,8,17,5,10,1,8,8,46,300,7,6,5,8,8,5,8,8,6,8,6,8,1,1,8,1,1,55,7,6,5,8,8,5,6,8,6,8,1,82];

async function processLineByLine() {
  const fileStream = fs.createReadStream(params[2]);
  const fileOut = fs.createWriteStream(params[3]);

  fileOut.write("2 RECORD ID 01=Emp 02=Dep,1 PRIMARY KEY TYPE ,9 PRIMARY KEY VALUE Emp SS#,1 FILLER ,0 LAST NAME ,5 FIRST NAME ,1 MIDDLE INITIAL ,3 SUFFIX ,8 DATE OF BIRTH YYYYMMDD,1 SEX M or F,9 SOCIAL SECURITY NUMBER PersonSS# not Emp,1 SURVIVING SPOUSE/COBRA ORIGINAL SUBSCRIBER KEY (SUBSCRIBER ID)ORIGINAL KEY TYPE ,9 ORIGINAL KEY VALUE ,1 FILLER,0 HOME TELEPHONE NUMBER AAAEEENNNN,0 BUSINESS TELEPHONE NUMBER ,4 FILLER ,0 ADDRESS 1 ,0 ADDRESS 2 ,0 CITY ,2 STATE CODE ,9 ZIP CODE ,9 WORK ZIP CODE** ,1 FULL TIME STUDENT STATUS INDICATOR ,2 RELATIONSHIP CODE EE SP or CH,1 DECEASED INDICATOR ,8 DECEASED DATE ,1 HANDICAP/DISABLED INDICATOR ,1 RETIREE INDICATOR ,8 RETIREE DATE ,1 PRIOR KEY TYPE ,9 PRIOR KEY VALUE ,1 FILLER ,8 CURRENT SALARY ,8 SALARY EFFECTIVE DATE ,1 SALARY FREQUENCY INDICATOR ,8 HIRE DATE YYYYMMDD,8 YEARS OF SERVICE START DATE,0 MEMBER EMAIL ADDRESS ,9 EMPLOYEE ID ,1 FILLER ,1 OTHER INSURANCE INDICATOR ,2 MEDICARE HIC NUMBER ,1 COVERAGE TYPE 1 ,2 CARRIER 1 ,1 MEDICARE TYPE 1 ,8 EFFECTIVE DATE 1 ,8 CANCELED DATE 1 ,1 PRIMACY CODE 1 ,2 FINANCIAL RESPONSIBILITY 1 ,5 POLICY NUMBER 1 ,1 COVERAGE TYPE 2 ,2 CARRIER 2 ,1 MEDICARE TYPE 2 ,8 EFFECTIVE DATE 2 ,8 CANCELED DATE 2 ,1 PRIMACY CODE 2 ,2 FINANCIAL RESPONSIBILITY 2 ,5 POLICY NUMBER 2 ,1 COVERAGE TYPE 3 DELETE OI3 ,2 CARRIER 3 ,1 MEDICARE TYPE 3 ,8 EFFECTIVE DATE 3 ,8 CANCELED DATE 3 ,1 PRIMACY CODE 3 ,2 FINANCIAL RESPONSIBILITY 3 ,5 POLICY NUMBER 3 ,3 FILLER ,1 EMPLOYMENT STATUS CODE INDICATOR ,8 EMPLOYMENT STATUS CODE EFFECTIVE DATE ,9 FEDERAL SSN (see Notes) ,0 Employee Location ,1 FILLER ,7 MEDICAL ACCOUNT NUMBER ,6 MEDICAL BRANCH CODE ,5 MEDICAL BENEFIT OPTION CODE ,8 MEDICAL COVERAGE EFFECTIVE DATE YYYYMDD,8 MEDICAL COVERAGE CANCEL DATE NULL if Not Termed,1 MEDICAL EMPLOYEE COVERAGE INDICATOR ,1 MEDICAL SPOUSE COVERAGE INDICATOR SP Y or N,1 MEDICAL CHILDREN COVERAGE INDICATOR CH Y or N,1 MEDICAL COLLATERAL COVERAGE INDICATOR ,1 FILLER ,8 MEDICAL COBRA EFFECTIVE DATE ,8 MEDICAL COBRA PAID THRU DATE ,7 FILLER ,5 MEDICAL NETWORK ID ,0 MEDICAL PCP ID ,1 MEDICAL ESTABLISHED PATIENT INDICATOR ,8 MEDICAL PCP/HMO/NETWORK EFFECTIVE DATE ,8 MEDICAL PRE-EXISTING CONDITION LIMITATION END DATE (PCL End Date) ,6 FILLER FIELD 94 IN CIGNA ACE FILE SPECIFICATION,0 SPACE FOR FILEDS 95 to 130,7 HRA NUMBER,6 HRA BRANCH CODE ,5 HRA BENEFIT OPTION,8 HRA COVERAGE EFFECTIVE DATE,8 HRA COVERAGE CANCEL DATE,5 FILLER FIELD 137 ,8 HRA COBRA EFFECTIVE DATE,8 HRA COBRA PAID THRU DATE,6 HRA EMPLOYER GOAL AMOUNT,8 HRA EMPLOYER GOAL AMOUNT EFFECTIVE DATE,6 HRA EMPLOYEE GOAL AMOUNT,8 HRA EMPLOYEE GOAL AMOUNT EFFECTIVE DATE,1 HRA EMPLOYER DIRECTED REIMBURSEMENT (EDR) INDICATOR,1 HRA AUTO CLAIM FORWARDING MEDICAL IND,8 HRA AUTO CLAIM FORWARDING MEDICAL DENTAL AND PHARMACY EFFECTIVE DATE,1 HRA AUTO CLAIM FORWARDING DENTAL IND,1 HRA AUTO CLAIM FORWARDING PHARMACY INDICATOR,5 FILLER FIELD 149,7 DCRA NUMBER,6 DCRA BRANCH CODE,5 DCRA BENEFIT OPTION,8 DCRA COVERAGE EFFECTIVE DATE,8 DCRA COVERAGE CANCEL DATE,5 FILLER 156,6 DCRA EMPLOYER GOAL AMOUNT,8 DCRA EMPLOYER GOAL AMOUNT EFFECTIVE DATE,6 DCRA EMPLOYEE GOAL AMOUNT,8 DCRA EMPLOYEE GOAL AMOUNT EFFECTIVE DATE,1 DCRA EMPLOYER DIRECTED REIMBURSEMENT (EDR) INDICATOR,2 FILLER 162");
  
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const aline of rl) {
    let line = aline.replace(/,/g,' ');
    let startpos = 0;
    let endpos;
    let fieldnum = 0;
    let dates = [9,27,30,35,37,38,47,48,55,56,63,64,70,77,78,84,85,90,91,97,98,100,101,103,105,108,115,116,119,121];
    dates = dates.map(n => n - 1); //oops
    widths.forEach(width=>{
      endpos = startpos + width;
      let out = line.substring(startpos,endpos) + ",";
      if (dates.includes(fieldnum) && out != "        ,") {
        out = out.substring(0,4) + "-" + out.substring(4,6) + "-" + out.substring(6,8) + ",";
      }
      fileOut.write(out);
      startpos = endpos;
      fieldnum += 1;
    });
    fileOut.write("\n");
  }
}

processLineByLine();