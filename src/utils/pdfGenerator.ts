import { jsPDF } from 'jspdf';
import type { IDCardConfig } from '../types';

// Helper to convert an image source (URL, SVG, or data URI) to an HTMLImageElement
const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
};

// Convert image element to base64 Data URL via canvas
const imageToDataUrl = (img: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth || img.width || 300;
  canvas.height = img.naturalHeight || img.height || 150;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  }
  return '';
};

export interface PDFGenerationProgressCallback {
  (progress: { step: number; percentage: number; message: string }): void;
}

export const generateBulkIDPDF = async (
  config: IDCardConfig,
  onProgress?: PDFGenerationProgressCallback
): Promise<jsPDF> => {
  onProgress?.({
    step: 1,
    percentage: 15,
    message: 'Preparing ID card design & assets...'
  });

  // Pre-load BCAS logo
  let bcasLogoDataUrl = '';
  try {
    const bcasImg = await loadImage('/bcas-logo.png');
    bcasLogoDataUrl = imageToDataUrl(bcasImg);
  } catch (e) {
    console.warn('Could not load local bcas-logo.png directly, trying fallback', e);
  }

  // Pre-load Partner logo if present
  let partnerLogoDataUrl = '';
  if (config.partnerLogoData) {
    partnerLogoDataUrl = config.partnerLogoData;
  } else if (config.partnerLogoUrl) {
    try {
      const pImg = await loadImage(config.partnerLogoUrl);
      partnerLogoDataUrl = imageToDataUrl(pImg);
    } catch (e) {
      console.warn('Could not load partner logo from URL', e);
    }
  }

  onProgress?.({
    step: 2,
    percentage: 40,
    message: 'Rendering card artwork & typography...'
  });

  // Exact A4 portrait configuration: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  const totalCards = Math.max(1, config.numberOfCards);
  const totalPages = Math.ceil(totalCards / 9);

  // Exact Dimensions in millimeters:
  const cardWidth = 55;
  const cardHeight = 85;
  const marginX = 15; // Left & Right margins: 15mm
  const marginY = 14; // Top & Bottom margins: 14mm
  const gapX = 7.5;   // Horizontal gap: 7.5mm (15 + 55 + 7.5 + 55 + 7.5 + 55 + 15 = 210mm)
  const gapY = 7.0;   // Vertical gap: 7mm (14 + 85 + 7 + 85 + 7 + 85 + 14 = 297mm)

  const currentIntake = config.intake === 'Custom Intake...' 
    ? (config.customIntake || 'Custom Intake') 
    : config.intake;

  // Resolve academicYear once — never let it be blank on the card
  const currentAcademicYear = (config.academicYear || '').trim() || '2026/2027';

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) {
      doc.addPage('a4', 'portrait');
    }

    onProgress?.({
      step: 3,
      percentage: 50 + Math.round((page / totalPages) * 30),
      message: `Arranging cards on A4 page ${page + 1} of ${totalPages}...`
    });

    // Page Margin Header & Footer Information
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `BCAS IDForge — Official Temporary Pass Bulk Sheet (3x3 Layout) — Page ${page + 1} of ${totalPages}`,
      marginX,
      marginY - 5
    );
    doc.text(
      `Scale: 100% Actual Size (55 x 85 mm) — Do Not Fit to Page`,
      210 - marginX,
      marginY - 5,
      { align: 'right' }
    );

    doc.text(
      `British College of Applied Studies — Generated on ${new Date().toLocaleDateString()}`,
      marginX,
      297 - marginY + 6
    );
    doc.text(
      `Use cutting guides at corners for precision trimming | Year: ${currentAcademicYear}`,
      210 - marginX,
      297 - marginY + 6,
      { align: 'right' }
    );

    // Loop through 3 rows and 3 columns (up to 9 cards per page)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cardIndex = page * 9 + (row * 3 + col);
        if (cardIndex >= totalCards) {
          // Exactly stop rendering once requested card count is reached!
          break;
        }

        const posX = marginX + col * (cardWidth + gapX);
        const posY = marginY + row * (cardHeight + gapY);

        const currentPassNumber = `${config.idPrefix}${String(config.startNumber + cardIndex).padStart(4, '0')}`;

        // 1. Draw Corner Cutting Guides / Crop Marks
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.15);
        const guideLen = 2.5;
        // Top-left corner
        doc.line(posX - guideLen, posY, posX, posY);
        doc.line(posX, posY - guideLen, posX, posY);
        // Top-right corner
        doc.line(posX + cardWidth, posY, posX + cardWidth + guideLen, posY);
        doc.line(posX + cardWidth, posY - guideLen, posX + cardWidth, posY);
        // Bottom-left corner
        doc.line(posX - guideLen, posY + cardHeight, posX, posY + cardHeight);
        doc.line(posX, posY + cardHeight, posX, posY + cardHeight + guideLen);
        // Bottom-right corner
        doc.line(posX + cardWidth, posY + cardHeight, posX + cardWidth + guideLen, posY + cardHeight);
        doc.line(posX + cardWidth, posY + cardHeight, posX + cardWidth, posY + cardHeight + guideLen);

        // 2. Card Background & Outer Boundary
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(220, 225, 230);
        doc.setLineWidth(0.2);
        // Rounded card border (radius 2mm)
        doc.roundedRect(posX, posY, cardWidth, cardHeight, 2, 2, 'FD');

        // 3. Red Top Header Section
        const headerHeight = 15;
        doc.setFillColor(200, 16, 46); // BCAS Red #c8102e
        // Top section with rounded top corners
        doc.rect(posX, posY, cardWidth, headerHeight, 'F');
        // Round top corners
        doc.roundedRect(posX, posY, cardWidth, headerHeight + 2, 2, 2, 'F');
        // Clean lower boundary for curve
        doc.rect(posX, posY + 2, cardWidth, headerHeight - 2, 'F');

        // Header Text
        doc.setTextColor(255, 235, 238);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5);
        doc.text('BCAS CAMPUS', posX + cardWidth / 2, posY + 4, { align: 'center' });

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.text('TEMPORARY STUDENT PASS', posX + cardWidth / 2, posY + 8.5, { align: 'center' });

        doc.setTextColor(255, 235, 238);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(4.2);
        doc.text('OFFICIAL STUDENT IDENTIFICATION', posX + cardWidth / 2, posY + 12, { align: 'center' });

        // 4. Blue Curved Wave Divider Below Header
        // Fill blue curve shape
        doc.setFillColor(0, 45, 98); // BCAS Blue #002d62
        doc.rect(posX, posY + headerHeight, cardWidth, 2.8, 'F');

        // Highlight line
        doc.setDrawColor(2, 132, 199);
        doc.setLineWidth(0.2);
        doc.line(posX, posY + headerHeight + 2.8, posX + cardWidth, posY + headerHeight + 2.8);

        // 5. Card Pass Number & Reference
        const contentStartY = posY + headerHeight + 5.5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.2);
        doc.setTextColor(120, 130, 140);
        doc.text('PASS NO:', posX + 3, contentStartY);

        doc.setFont('courier', 'bold');
        doc.setFontSize(7.2);
        doc.setTextColor(0, 45, 98);
        doc.text(currentPassNumber, posX + cardWidth - 3, contentStartY, { align: 'right' });

        // 6. Programme Name (with dynamic font sizing)
        const progY = contentStartY + 4.8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.0);
        doc.setTextColor(100, 110, 120);
        doc.text('ACADEMIC PROGRAMME', posX + cardWidth / 2, progY, { align: 'center' });

        const progName = config.programmeName || 'BSc (Hons) Computer Science';
        let progFontSize = 11.5;
        if (progName.length > 45) {
          progFontSize = 8.5;
        } else if (progName.length > 28) {
          progFontSize = 10.0;
        }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(progFontSize);
        doc.setTextColor(15, 23, 42);
        const splitTitle = doc.splitTextToSize(progName, cardWidth - 8);
        const titleLineHeight = progFontSize * 0.38;
        doc.text(splitTitle, posX + cardWidth / 2, progY + 4.2, { align: 'center' });

        // 7. Intake & Academic Year Box (with large, bold, prominent typography)
        const titleBlockHeight = splitTitle.length * titleLineHeight;
        const boxY = progY + 4.2 + titleBlockHeight + 1.5;
        const boxHeight = 15.0;

        doc.setFillColor(248, 250, 252);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.25);
        doc.roundedRect(posX + 3, boxY, cardWidth - 6, boxHeight, 1.2, 1.2, 'FD');

        // Intake Row
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.8);
        doc.setTextColor(100, 116, 139);
        doc.text('INTAKE:', posX + 5, boxY + 5.5);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.0);
        doc.setTextColor(200, 16, 46);
        doc.text(currentIntake, posX + cardWidth - 5, boxY + 5.5, { align: 'right' });

        // Divider Line
        doc.setDrawColor(226, 232, 240);
        doc.line(posX + 4.5, boxY + 7.8, posX + cardWidth - 4.5, boxY + 7.8);

        // Academic Year Row
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(5.8);
        doc.setTextColor(100, 116, 139);
        doc.text('ACADEMIC YEAR:', posX + 5, boxY + 12.6);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.0);
        doc.setTextColor(0, 45, 98);
        doc.text(currentAcademicYear, posX + cardWidth - 5, boxY + 12.6, { align: 'right' });

        // 8. Barcode Graphic (if enabled) & Validity Notice
        const noticeY = config.showBarcode ? boxY + boxHeight + 10.5 : boxY + boxHeight + 4.5;
        if (config.showBarcode) {
          const barcodeY = boxY + boxHeight + 2;
          const barWidths = [0.4, 0.2, 0.6, 0.2, 0.4, 0.6, 0.2, 0.4, 0.2, 0.6, 0.4, 0.2, 0.6, 0.2, 0.4, 0.2, 0.6, 0.4, 0.2, 0.4];
          const gapBetweenBars = 0.4;
          // Calculate total barcode width to center it
          const totalBarcodeWidth = barWidths.reduce((sum, w) => sum + w + gapBetweenBars, 0) - gapBetweenBars;
          let currentBarX = posX + (cardWidth - totalBarcodeWidth) / 2;
          doc.setFillColor(30, 41, 59);
          barWidths.forEach((w) => {
            doc.rect(currentBarX, barcodeY, w, 3.8, 'F');
            currentBarX += w + gapBetweenBars;
          });

          doc.setFont('courier', 'normal');
          doc.setFontSize(4.2);
          doc.setTextColor(100, 116, 139);
          doc.text(`*${currentPassNumber}*`, posX + cardWidth / 2, barcodeY + 6.2, { align: 'center' });
        }

        // Validity notice
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(4.2);
        doc.setTextColor(130, 140, 150);
        doc.text(
          'Official temporary pass. Present on campus upon request.',
          posX + cardWidth / 2,
          noticeY,
          { align: 'center' }
        );

        // 9. Bottom Logo Area
        const logoSectionY = posY + cardHeight - 16;
        if (partnerLogoDataUrl && bcasLogoDataUrl) {
          // Both logos: BCAS on Left, Partner on Right
          doc.addImage(bcasLogoDataUrl, 'PNG', posX + 3, logoSectionY, 22, 10, undefined, 'FAST');
          // Vertical divider line
          doc.setDrawColor(220, 225, 230);
          doc.setLineWidth(0.2);
          doc.line(posX + 27.5, logoSectionY + 1, posX + 27.5, logoSectionY + 9);
          // Partner logo
          try {
            doc.addImage(partnerLogoDataUrl, 'PNG', posX + 30, logoSectionY, 22, 10, undefined, 'FAST');
          } catch (e) {
            console.warn('Could not add partner image to PDF', e);
          }
        } else if (bcasLogoDataUrl) {
          // Centered BCAS Logo
          const logoW = 28;
          const logoH = 11;
          doc.addImage(
            bcasLogoDataUrl,
            'PNG',
            posX + (cardWidth - logoW) / 2,
            logoSectionY - 0.5,
            logoW,
            logoH,
            undefined,
            'FAST'
          );
        }

        // 10. Bottom Red Curved Accent Decoration
        doc.setFillColor(200, 16, 46); // BCAS Red
        doc.rect(posX, posY + cardHeight - 3.5, cardWidth, 3.5, 'F');
        // Round bottom corners
        doc.roundedRect(posX, posY + cardHeight - 4, cardWidth, 4, 2, 2, 'F');
        doc.rect(posX, posY + cardHeight - 4, cardWidth, 2, 'F');

        // Tiny accent strip
        doc.setFillColor(0, 45, 98); // BCAS Blue
        doc.rect(posX, posY + cardHeight - 4, cardWidth, 0.5, 'F');
      }
    }
  }

  onProgress?.({
    step: 4,
    percentage: 95,
    message: 'Generating print-ready PDF document...'
  });

  return doc;
};
