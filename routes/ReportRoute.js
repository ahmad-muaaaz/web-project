import express from "express";
import pdf from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
import orderModel from "../models/orderModel.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

router.get('/sales-report', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const salesData = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: null,
          totalSales: {
            $sum: { $toDouble: "$payment.transaction.amount" }, // Convert amount to a number
          },
        },
      },
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Create a PDF document
    const doc = new pdf();
    const pdfFilePath = path.join(__dirname, '..', 'reports', 'sales-report.pdf');
    doc.pipe(fs.createWriteStream(pdfFilePath));

    // Add content to the PDF
    doc.fontSize(16).text('Sales Report', { align: 'center' });
    doc.text('------------------------------------------------------------------------------------');
    
    // Hardcoded headings and total sales
    doc.text('Date Range: ' + startDate + ' to ' + endDate, { align: 'left' });
    doc.text('Total Sales:', { align: 'center' });
    doc.text('$' + totalSales.toFixed(2) || '0', { align: 'center' });

    doc.end();

    // Send the PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
    fs.createReadStream(pdfFilePath).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/generate-pdf-report', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const salesData = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $toDouble: "$payment.transaction.amount" } }, // Convert amount to a number
        },
      },
    ]);

    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    // Create a PDF document for the report
    const doc = new pdf();
    doc.pipe(fs.createWriteStream(path.join(__dirname, '..', 'reports', 'sales-report.pdf')));

    // Add content to the PDF
    doc.fontSize(16).text('Sales Report', { align: 'center' });
    doc.text('------------------------------------------------------------------------------------');

    // Hardcoded headings and total sales
    doc.text('Date Range: ' + startDate + ' to ' + endDate, { align: 'left' });
    doc.text('Total Sales:', { align: 'center' });
    doc.text('$' + totalSales.toFixed(2) || '0', { align: 'center' });

    doc.end();

    // Send the generated PDF as a response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
    fs.createReadStream(path.join(__dirname, '..', 'reports', 'sales-report.pdf')).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;
