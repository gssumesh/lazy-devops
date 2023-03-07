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
const sheet = workbook.addWorksheet("AWS Well-Architected Framework");

// Define the headers for the Excel sheet
sheet.columns = [
  { header: "Lens", key: "lens" },
  { header: "Pillar", key: "pillar" },
  { header: "Question", key: "question" },
  { header: "Choice", key: "choice" },
  {header: "Choice Description", key: "choiceDescription"}
];

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

let generate = async () => {
  console.log("Start");
  for await (const answer of scanAWSWorkloadAnswers({
    WorkloadId: workloadId,
    LensAlias: "wellarchitected",
  })) {
    const { PillarId, QuestionTitle, Choices } = answer;
    console.log(PillarId, QuestionTitle, Choices);
    Choices.forEach(choice => {
        sheet.addRow({
            lens: "wellarchitected",
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

generate();
