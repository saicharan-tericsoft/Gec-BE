"use strict";
// import archiver from 'archiver';
// import { TestResult } from '../test/model';
// import { generateBmiPdf, generateIshiharaPdf } from '../pdf/service';
// export const buildZipStream = async (res: any) => {
//   const archive = archiver('zip', { zlib: { level: 9 } });
//   archive.pipe(res);
//   const results = await TestResult.find();
//   const grouped: Record<string, any> = {};
//   results.forEach((r: any) => {
//     if (!grouped[r.applicationId]) {
//       grouped[r.applicationId] = {};
//     }
//     grouped[r.applicationId][r.testType.toLowerCase()] = r;
//   });
//   for (const appId of Object.keys(grouped)) {
//     const student = grouped[appId];
//     // BMI
//     if (student.bmi) {
//       const buffer = await generateBmiPdf(student.bmi);
//       archive.append(buffer, {
//         name: `${appId}/bmi-report.pdf`
//       });
//     }
//     // ISHIHARA
//     if (student.ishara || student.ishihara) {
//       const buffer = await generateIshiharaPdf(
//         student.ishara || student.ishihara
//       );
//       archive.append(buffer, {
//         name: `${appId}/ishihara-report.pdf`
//       });
//     }
//   }
//   await archive.finalize();
// };
