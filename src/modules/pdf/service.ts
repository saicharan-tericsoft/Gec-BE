import PDFDocument from 'pdfkit';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { PassThrough } from 'stream';

const getBufferFromDoc = (doc: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    const chunks: any[] = [];

    doc.pipe(stream);

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);

    doc.end();
  });
};

const width = 400;
const height = 200;

export const generateBMIPdf = async (data: any) => {
  const doc = new PDFDocument({ margin: 40 });

  const bmi = data.result.bmi.toFixed(1);
  const now = new Date().toLocaleString();
    // --- GAUGE CHART ---
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

  const configuration: any = {
    type: 'doughnut',
    data: {
      labels: ['Under', 'Normal', 'Overweight', 'Obese'],
      datasets: [
        {
          data: [18.5, 6.4, 5, 10],
          backgroundColor: ['#4A90E2', '#50C878', '#F5A623', '#D0021B']
        }
      ]
    },
    options: {
      rotation: -90,
      circumference: 180,
      plugins: { legend: { display: false } }
    }
  };

  const image = await chartJSNodeCanvas.renderToBuffer(configuration);

  // ---------------- HEADER ----------------
  doc.fontSize(18).text('BMI Calculator Report', { align: 'center' });
  doc.fontSize(12).text('Body Mass Index Assessment', { align: 'center' });

  doc.moveDown(0.5);
  doc.fontSize(9).fillColor('gray')
    .text('GlobalECare.com', { align: 'center' })
    .text(`Generated: ${now}`, { align: 'center' });

  doc.moveDown(1.5);
  doc.fillColor('black');

  // ---------------- PATIENT INFO ----------------
  doc
  .fillColor('#50C878')   // set text color to green
  .fontSize(12)
  .text('PATIENT INFORMATION', { underline: true });

  doc.fillColor('black');   // reset back to default
  doc.moveDown(0.5);

  const leftX = 40;
  const midX = 250;

  doc.fontSize(10);

  doc.text(`Name: ${data.name}`, leftX);
  doc.text(`Age: ${data.age} years`, midX);

  doc.text(`Sex: ${data.sex}`, leftX);
  doc.text(`Ref ID: ${data.applicationId}`, midX);

  doc.text(`Height: ${data.responses.height} cm`, leftX);
  doc.text(`Weight: ${data.responses.weight} kg`, midX);

  doc.text(`Test Date: ${now}`, leftX);

  doc.moveDown(1.5);

  // ---------------- BMI RESULT ----------------
  doc.fontSize(28).text(bmi, { align: 'center' });
  doc.fontSize(14).fillColor('green')
    .text(data.result.category, { align: 'center' });

  doc.fillColor('black');
  doc.moveDown(1.5);

  // ---------------- INTERPRETATION ----------------
  doc.fontSize(12).fillColor('#50C878').text('INTERPRETATION', { underline: true });
  doc.moveDown(0.5);
  doc.fillColor('black');

  doc.fontSize(10).text(getInterpretation(data.result.category));

  doc.moveDown(0.5);

  doc.text(
    `Fogarty Center ideal range for ${data.sex.toLowerCase()} at ${(data.responses.height / 100).toFixed(2)} m: 66–82 kg. Obesity: >= 98 kg.`
  );

  doc.text(
    `Healthy weight range (BMI 18.5–24.9): 53.5 – 72.0 kg`
  );

  doc.moveDown(1.5);

  // ---------------- WHO TABLE ----------------
  doc.fontSize(12).fillColor('#50C878').text('WHO BMI CLASSIFICATION', { underline: true });
  doc.fillColor('black');
  doc.moveDown(0.5);

  const rows = [
    ['Underweight', '< 18.5'],
    ['Normal Weight', '18.5 – 24.9'],
    ['Overweight', '25.0 – 29.9'],
    ['Obese Class I', '30.0 – 34.9'],
    ['Obese Class II', '35.0 – 39.9'],
    ['Obese Class III', '>= 40.0']
  ];

  let y = doc.y;

  rows.forEach(row => {
    doc.text(row[0], 50, y);
    doc.text(row[1], 300, y);
    y += 18;
  });

  doc.y = y + 10;

  // ---------------- IDEAL BODY TABLE ----------------
  doc.fontSize(12)
.fillColor('#50C878')
   .text('IDEAL BODY WEIGHT CHART', leftX, doc.y, { underline: true });
  doc.fillColor('black');
  doc.moveDown(0.3);

  doc.fontSize(8).text(
    'Fogarty Center Conference on Obesity (1973, Bray 1979) & Metropolitan Life Insurance Tables (1959)'
  );

  doc.moveDown(0.5);

  const idealRows = [
    ['1.60', '59 – 74', '>= 89'],
    ['1.62', '60 – 75', '>= 90'],
    ['1.64', '62 – 77', '>= 92'],
    ['1.66', '64 – 79', '>= 95'],
    ['1.68', '65 – 80', '>= 96'],
    ['1.70', '66 – 82', '>= 98'],
    ['1.72', '67 – 84', '>= 101'],
    ['1.74', '69 – 86', '>= 102'],
    ['1.76', '71 – 88', '>= 106'],
    ['1.78', '73 – 90', '>= 108']
  ];

  let yX = doc.y;

  idealRows.forEach(row => {
    doc.text(row[0], 50, yX);
    doc.text(row[1], 150, yX);
    doc.text(row[2], 300, yX);
    yX += 16;
  });

  doc.y = yX + 10;
  doc.moveDown(2.5);

  // ---------------- RECOMMENDATIONS ----------------

// Title
doc.fontSize(12)
.fillColor('#50C878')
   .text('RECOMMENDATIONS', leftX, doc.y, { underline: true });
   doc.fillColor('black');

doc.moveDown(0.5);

// Content
const recs = [
  'Balanced diet: fruits, vegetables, whole grains, lean proteins',
  '150+ min moderate aerobic activity per week',
  'Regular weight monitoring',
  'Consult healthcare provider if needed',
  'Adequate sleep (7–9 hours)'
];

doc.fontSize(10);

recs.forEach(r => {
  doc.text(`• ${r}`, leftX);
});

doc.moveDown(1);

  // ---------------- DISCLAIMER ----------------
  doc.fontSize(8).fillColor('gray').text(
    'Disclaimer: BMI is a screening tool, not diagnostic. Consult a healthcare professional.'
  );

  doc.moveDown(0.5);

  doc.text(
    'Source: Fogarty Center Conference (1973) & WHO BMI guidelines.'
  );

  doc.moveDown(0.5);

  doc.text('GlobalECare.com — BMI Calculator & Report Tool');

  doc.end();
  return doc;
};

// export const generateBMIPdf = async (data: any): Promise<any> => {
//   const doc = new PDFDocument({ margin: 40 });

//   const now = new Date(data.createdAt).toLocaleString();

//   // ---------------- HEADER ----------------
//   doc.fontSize(20).text('BMI Calculator Report', { align: 'center' });
//   doc.fontSize(12).text('Body Mass Index Assessment', { align: 'center' });

//   doc.moveDown(0.5);
//   doc.fontSize(10).text('GlobalECare.com', { align: 'center' });
//   doc.text(`Generated: ${now}`, { align: 'center' });

//   doc.moveDown(1.5);

//   // ---------------- PATIENT INFO ----------------
//   doc.fontSize(14).text('PATIENT INFORMATION', { underline: true });
//   doc.moveDown(0.5);

//   doc.fontSize(11)
//     .text(`Name: ${data.patient?.name || 'N/A'}`)
//     .text(`Age: ${data.patient?.age || 'N/A'} years`)
//     .text(`Sex: ${data.responses.gender}`)
//     .text(`Ref ID: ${data.patient?.refId || '-'}`);

//   doc.moveDown(0.5);

//   doc.text(`Height: ${data.responses.height} cm (${(data.responses.height/100).toFixed(2)} m)`);
//   doc.text(`Weight: ${data.responses.weight} kg`);
//   doc.text(`Test Date: ${now}`);

//   doc.moveDown(2);

//   // ---------------- BMI RESULT ----------------
//   doc.fontSize(36)
//      .fillColor('#2f855a')
//      .text(data.result.bmi.toFixed(1), { align: 'center' });

//   doc.moveDown(0.3);

//   doc.fontSize(16)
//      .fillColor('black')
//      .text(data.result.category, { align: 'center' });

//   doc.moveDown(1.5);

//   // ---------------- INTERPRETATION ----------------
//   doc.fontSize(14).text('INTERPRETATION', { underline: true });
//   doc.moveDown(0.5);

//   doc.fontSize(11).text(
//     getInterpretationText(data.result.category)
//   );

//   doc.moveDown(1);

//   doc.text(
//     `Healthy weight range (BMI 18.5–24.9): ${getHealthyRange(data.responses.height)} kg`
//   );

//   doc.moveDown(1.5);

//   // ---------------- WHO TABLE ----------------
//   doc.fontSize(14).text('WHO BMI CLASSIFICATION', { underline: true });
//   doc.moveDown(0.5);

//   const tableStartX = 50;

//   doc.fontSize(10);
//   doc.text('Category', tableStartX);
//   doc.text('BMI Range', tableStartX + 200);

//   doc.moveDown(0.3);
//   doc.moveTo(tableStartX, doc.y).lineTo(500, doc.y).stroke();
//   doc.moveDown(0.5);

//   const rows = [
//     ['Underweight', '< 18.5'],
//     ['Normal Weight', '18.5 – 24.9'],
//     ['Overweight', '25.0 – 29.9'],
//     ['Obese Class I', '30.0 – 34.9'],
//     ['Obese Class II', '35.0 – 39.9'],
//     ['Obese Class III', '>= 40.0']
//   ];

//   rows.forEach(row => {
//     doc.text(row[0], tableStartX);
//     doc.text(row[1], tableStartX + 200);
//     doc.moveDown(0.3);
//   });

//   doc.moveDown(1.5);

//   // ---------------- IDEAL BODY TABLE ----------------
//   doc.fontSize(14).text('IDEAL BODY WEIGHT CHART', { underline: true });
//   doc.moveDown(0.5);

//   const idealRows = [
//     ['1.60', '59 – 74', '>= 89'],
//     ['1.65', '63 – 78', '>= 94'],
//     ['1.70', '66 – 82', '>= 98'],
//     ['1.75', '70 – 87', '>= 103']
//   ];

//   doc.fontSize(10);
//   doc.text('Height (m)', tableStartX);
//   doc.text('Range (kg)', tableStartX + 120);
//   doc.text('Obese (kg)', tableStartX + 250);

//   doc.moveDown(0.3);
//   doc.moveTo(tableStartX, doc.y).lineTo(500, doc.y).stroke();
//   doc.moveDown(0.5);

//   idealRows.forEach(row => {
//     doc.text(row[0], tableStartX);
//     doc.text(row[1], tableStartX + 120);
//     doc.text(row[2], tableStartX + 250);
//     doc.moveDown(0.3);
//   });

//   doc.moveDown(1.5);

//   // ---------------- RECOMMENDATIONS ----------------
//   doc.fontSize(14).text('RECOMMENDATIONS', { underline: true });
//   doc.moveDown(0.5);

//   const recommendations = [
//     'Balanced diet: fruits, vegetables, whole grains, lean proteins',
//     '150+ minutes of physical activity per week',
//     'Regular weight monitoring',
//     'Adequate sleep (7–9 hours)',
//     'Consult doctor if BMI outside range'
//   ];

//   recommendations.forEach(r => {
//     doc.text(`• ${r}`);
//   });

//   doc.moveDown(1.5);

//   // ---------------- DISCLAIMER ----------------
//   doc.fontSize(8)
//      .fillColor('gray')
//      .text(
//        'Disclaimer: BMI is a screening tool, not diagnostic. Consult a healthcare professional.',
//        { align: 'center' }
//      );

// //   return await getBufferFromDoc(doc);
// return doc;
// };

const getInterpretationText = (category: string) => {
  if (category === 'Normal') {
    return 'You are within the healthy weight range. Maintain a balanced diet and regular exercise.';
  }
  if (category === 'Overweight') {
    return 'You are above the recommended weight range. Consider lifestyle changes.';
  }
  return 'Your BMI indicates a health risk. Consult a healthcare provider.';
};

const getHealthyRange = (height: number) => {
  const h = height / 100;
  const min = (18.5 * h * h).toFixed(1);
  const max = (24.9 * h * h).toFixed(1);
  return `${min} – ${max}`;
};

const getInterpretation = (category: string) => {
  switch (category) {
    case 'Normal':
      return 'You are within the healthy weight range.';
    case 'Overweight':
      return 'You are above normal weight. Consider lifestyle adjustments.';
    case 'Underweight':
      return 'You are below normal weight. Nutritional consultation recommended.';
    default:
      return 'High BMI. Medical consultation advised.';
  }
};

// export const generateIshiharaPdf = async (data: any) => {
//   const doc = new PDFDocument({ margin: 40 });

//   // ---------------- HEADER ----------------
//   doc.fontSize(20).text('Ishihara Color Vision Report', { align: 'center' });
//   doc.moveDown(0.5);

//   doc.fontSize(10).text(
//     `Application ID: ${data.applicationId} | Date: ${new Date(data.createdAt).toLocaleString()}`,
//     { align: 'center' }
//   );

//   doc.moveDown(2);

//   // ---------------- PATIENT INFO ----------------
// //   doc.fontSize(14).text('Patient Information', { underline: true });
// //   doc.moveDown(0.5);
// //   doc.fontSize(11).text(`Name: ${data.patient?.name || '-'}`);
// //   doc.text(`Age: ${data.patient?.age || '-'}`);
// //   doc.text(`Gender: ${data.patient?.gender || '-'}`);
// //   doc.text(`Email: ${data.patient?.email || '-'}`);

//   doc.moveDown(1.5);

//   // ---------------- SUMMARY BOX ----------------
//   doc.fontSize(14).text('Test Summary', { underline: true });
//   doc.moveDown(0.5);

//   doc.fontSize(11)
//     .text(`Total Questions: ${data.responses.totalQuestions}`)
//     .text(`Correct: ${data.result.correct}`)
//     .text(`Incorrect: ${data.result.incorrect}`)
//     .text(`Accuracy: ${data.result.accuracy}%`);

//   doc.moveDown(1);

//   // ---------------- RESULT HIGHLIGHT ----------------
//   const color = getResultColor(data.result.vision);

//   doc
//     .fontSize(16)
//     .fillColor(color)
//     .text(data.result.classification, { align: 'center' });

//   doc.fillColor('black');

//   doc.moveDown(1);

//   // ---------------- REMARKS ----------------
//   doc.fontSize(12).text('Remarks', { underline: true });
//   doc.fontSize(10).text(data.result.remarks || '-');

//   doc.moveDown(1);

//   // ---------------- INTERPRETATION ----------------
//   doc.fontSize(12).text('Medical Interpretation', { underline: true });
//   doc.fontSize(10).text(data.result.interpretation);

//   doc.moveDown(1.5);

//   // ---------------- RESPONSES TABLE ----------------
//   doc.fontSize(12).text('Plate-wise Responses', { underline: true });
//   doc.moveDown(0.5);

//   const answers = data.responses.answers;

//   // Table header
// doc.text('Plate', {
//   width: 200,
//   align: 'left'
// });

// doc.text('Answer', {
//   width: 200,
//   align: 'left'
// });

// const startX = 50;

// doc.fontSize(10)
//    .text('Plate', startX, doc.y, { width: 80 })
//    .text('Answer', startX + 100, doc.y, { width: 150 });

// doc.moveDown(0.5);

// doc.moveTo(startX, doc.y).lineTo(400, doc.y).stroke();

// doc.moveDown(0.5);

// answers.forEach((ans: string, index: number) => {
//   const y = doc.y;

//   doc.text(`${index + 1}`, startX, y, { width: 80 });
//   doc.text(ans || 'Skipped', startX + 100, y, { width: 150 });

//   doc.moveDown(0.5);
// });

//   doc.moveDown(1.5);

//   // ---------------- FOOTER ----------------
//   doc.fontSize(8).fillColor('gray').text(
//     'This is a screening report. Please consult a certified ophthalmologist for diagnosis.',
//     { align: 'center' }
//   );

//   doc.end();

// //   return await  getBufferFromDoc(doc);
//   return doc;
// };


export const generateIshiharaPdf = (data: any) => {
  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  const {
    patient = {},
    responses = {},
    result = {}
  } = data;

  const answers = responses.answers || [];
  const total = responses.totalQuestions || answers.length;

  const correct = result.correct || 0;
  const accuracy = result.accuracy || 0;

  // ---------------- HEADER ----------------
  doc
    .fontSize(18)
    .fillColor('#0b3d2e')
    .text('Ishihara Color Vision Test Report', { align: 'left' });

  doc.moveDown(0.2);

  doc
    .fontSize(10)
    .fillColor('#666')
    .text('38-Plate Screening Assessment');

  doc.moveDown();

  doc.moveTo(40, doc.y)
    .lineTo(555, doc.y)
    .stroke('#0b3d2e');

  doc.moveDown();

  // ---------------- PATIENT INFO ----------------
  doc
    .fontSize(12)
    .fillColor('#0b3d2e')
    .text('PATIENT INFORMATION');

  doc.moveDown(0.5);

  const leftX = 40;
  const rightX = 300;

  doc.fontSize(10).fillColor('#000');

  doc.text(`Name: ${"Demo Student"}`, leftX);
  doc.text(`Age: ${9}`, rightX);

  doc.text(`Sex: ${"Male"}`, leftX);
  doc.text(`Ref ID: ${patient.refId || '-'}`, rightX);

  doc.text(`Corrective Lenses: None`, leftX);
  doc.text(`Test Date: ${new Date().toLocaleString()}`, rightX);
  doc.moveDown(1); 

  doc.moveDown();

  // ---------------- SCORE BAR ----------------
// ---------------- SCORE BAR ----------------
const boxX = 40;
const boxY = doc.y;
const boxWidth = 515;
const boxHeight = 60;
const padding = 10;

// Draw background
doc
  .rect(boxX, boxY, boxWidth, boxHeight)
  .fill('#e6f0ec');

// Score (centered inside box)
doc
  .fillColor('#0b3d2e')
  .fontSize(16)
  .text(
    `${correct} / ${total} (${accuracy}%)`,
    boxX,
    boxY + padding,
    {
      width: boxWidth,
      align: 'center'
    }
  );

// Classification (below score, still inside box)
doc
  .fontSize(11)
  .fillColor('#333')
  .text(
    result.classification || '',
    boxX,
    boxY + padding + 22,
    {
      width: boxWidth,
      align: 'center'
    }
  );

// Move cursor BELOW the box (critical fix)
doc.y = boxY + boxHeight + 20;

  // ---------------- CATEGORY BREAKDOWN ----------------
  doc
    .fontSize(12)
    .fillColor('#0b3d2e')
    .text('CATEGORY BREAKDOWN');

  doc.moveDown(0.5);

  doc.fontSize(10).fillColor('#000');

  for(const [key, value] of Object.entries(result.category || {})) {
    const categoryValue = value as any;
    doc.text(`${key}: ${categoryValue?.correct}/${categoryValue?.total}`);
  }

  doc.moveDown();

  doc.text(`Total Plates: ${total}`);
  doc.text(`Correct: ${correct}`);
  doc.text(`Incorrect: ${result.incorrect || 0}`);
  doc.text(`Accuracy: ${accuracy}%`);

  doc.moveDown();

  // ---------------- TABLE HEADER ----------------
  // const tableTop = doc.y;
  // const colX = {
  //   plate: 40,
  //   category: 90,
  //   expected: 250,
  //   response: 350,
  //   result: 460
  // };

  // doc
  //   .rect(40, tableTop, 515, 20)
  //   .fill('#0b3d2e');

  // doc.fillColor('#fff').fontSize(10);

  // doc.text('Plate', colX.plate, tableTop + 5);
  // doc.text('Category', colX.category, tableTop + 5);
  // doc.text('Expected', colX.expected, tableTop + 5);
  // doc.text('Response', colX.response, tableTop + 5);
  // doc.text('Result', colX.result, tableTop + 5);

  // doc.moveDown();

  // ---------------- TABLE BODY ----------------
  // let y = tableTop + 25;

  // answers.forEach((ans: string, index: number) => {
  //   const isCorrect =
  //     ans &&
  //     ans.toLowerCase() ===
  //       (data.correctAnswers?.[index] || '').toLowerCase();

  //   const rowColor = index % 2 === 0 ? '#f7f7f7' : '#ffffff';

  //   doc.rect(40, y, 515, 20).fill(rowColor);

  //   doc.fillColor('#000').fontSize(9);

  //   doc.text(`${index + 1}`, colX.plate, y + 5);
  //   doc.text('-', colX.category, y + 5); // optional category
  //   doc.text('-', colX.expected, y + 5); // optional expected
  //   doc.text(ans || '-', colX.response, y + 5);

  //   doc
  //     .fillColor(isCorrect ? 'green' : 'red')
  //     .text(isCorrect ? '✓ Correct' : '✗ Incorrect', colX.result, y + 5);

  //   y += 20;

  //   // PAGE BREAK
  //   if (y > 750) {
  //     doc.addPage();
  //     y = 40;
  //   }
  // });

  doc.moveDown();

  // ---------------- INTERPRETATION ----------------
  doc.moveDown();

  doc
    .fontSize(12)
    .fillColor('#0b3d2e')
    .text('INTERPRETATION');

  doc.moveDown(0.5);

  doc
    .fontSize(10)
    .fillColor('#000')
    .text(result.interpretation || '');

  doc.moveDown();

  doc
    .fontSize(8)
    .fillColor('#666')
    .text(
      'Disclaimer: This is a screening test and not a medical diagnosis.',
      { align: 'center' }
    );

  doc.end();

  return doc;
};

const getResultColor = (vision: string) => {
  if (vision === 'normal') return 'green';
  if (vision === 'mild') return 'orange';
  return 'red';
};