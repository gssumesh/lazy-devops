const AWS = require("aws-sdk");
const Excel = require("exceljs");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the AWS SDK
const WA = new AWS.WellArchitected();

// Define the ID of the Well-Architected review to export
const workloadId = process.env.WORKLOAD_ID;

// Define the filename and path for the Excel file
const fileName = "AWS_Well-Architected_Framework.xlsx";
const filePath = "./" + fileName;

// Create a new Excel workbook and sheet
const workbook = new Excel.Workbook();

const getNewSheet = (name) => {
  const sheet = workbook.addWorksheet(name);
  // Define the headers for the Excel sheet
  sheet.columns = [
    { header: "Lens", key: "lens" },
    { header: "Pillar", key: "pillar" },
    { header: "Question", key: "question" },
    { header: "Choice", key: "choice" },
    {header: "Choice Description", key: "choiceDescription"}
  ];
  return sheet;
}


async function* scanAWSWorkloadAnswers(config) {
  let paginationToken;

  do {
    const query = { ...config, NextToken: paginationToken };
    const { NextToken, AnswerSummaries } = await WA.listAnswers(
      query
    ).promise();
    paginationToken = NextToken;

    for (const answer of AnswerSummaries) {
      yield answer;
    }
  } while (paginationToken);
}

const generate = async (lens, sheet) => {
  console.log("Start");
  for await (const answer of scanAWSWorkloadAnswers({
    WorkloadId: workloadId,
    LensAlias: lens,
  })) {
    const { PillarId, QuestionTitle, Choices } = answer;
    console.log(PillarId, QuestionTitle, Choices);
    Choices.forEach(choice => {
        sheet.addRow({
            lens,
            pillar: PillarId,
            question: QuestionTitle,
            choice: choice.Title,
            choiceDescription: choice.Description
          });
    })
  }
  // Save the Excel file
  await workbook.xlsx.writeFile(filePath);
  console.log("Excel file saved to " + filePath);
  console.log("End");
};

  const wellArchitectedSheet = getNewSheet("AWS Well-Architected Framework")
  generate('wellarchitected', wellArchitectedSheet);
  
  const serverlessSheet = getNewSheet("AWS Serverless")
  generate('serverless', serverlessSheet);