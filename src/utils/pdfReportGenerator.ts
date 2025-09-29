import jsPDF from 'jspdf';

export interface ProjectReportData {
  projectName: string;
  projectId: string;
  location: string;
  startDate: string;
  endDate: string;
  totalHoursSpent: number;
  totalPeopleWorked: number;
  squareFootage: {
    salesEstimate: number;
    operationsMeasurement: number;
    variance: number;
    variancePercentage: number;
  };
  labourCosts: {
    totalLabourCost: number;
    hourlyRate: number;
    overtimeHours: number;
    overtimeCost: number;
    regularHours: number;
    regularCost: number;
  };
  filmUsage: {
    totalFilmUsed: number;
    filmWaste: number;
    filmRecut: number;
    wastePercentage: number;
    recutPercentage: number;
    filmCostPerSqFt: number;
    totalFilmCost: number;
  };
  travelAccommodation: {
    totalTravelCost: number;
    accommodationCost: number;
    perDiemCost: number;
    totalTravelAccommodation: number;
    teamMembersTraveled: number;
    averageCostPerPerson: number;
  };
  qualityChecks: {
    passed: number;
    failed: number;
    successRate: number;
    averageQualityScore: number;
  };
  teamMembers: Array<{
    name: string;
    role: string;
    hoursWorked: number;
    performance: string;
    rating: number;
    tasksCompleted: number;
    qualityScore: number;
  }>;
}

export const generateProjectReportPDF = (data: ProjectReportData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with automatic line breaks
  const addText = (text: string, x: number, y: number, options: any = {}) => {
    const lines = doc.splitTextToSize(text, pageWidth - 2 * margin);
    doc.text(lines, x, y);
    return y + (lines.length * (options.fontSize || 10) * 0.4);
  };

  // Helper function to add a section header
  const addSectionHeader = (title: string, y: number) => {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    const newY = addText(title, margin, y, { fontSize: 14 });
    doc.setLineWidth(0.5);
    doc.line(margin, newY + 3, pageWidth - margin, newY + 3);
    return newY + 10;
  };

  // Helper function to add a metric row
  const addMetricRow = (label: string, value: string, y: number, isHighlighted = false) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', isHighlighted ? 'bold' : 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(label, margin + 10, y);
    doc.text(value, pageWidth - margin - 10, y, { align: 'right' });
    return y + 5;
  };

  // Header
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Safe Haven Logo/Text
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SAFE HAVEN', 20, 18);
  
  // Safe Haven Logo Circle
  doc.setFillColor(255, 255, 255);
  doc.circle(20, 28, 6, 'F');
  doc.setFontSize(8);
  doc.setTextColor(41, 128, 185);
  doc.text('SH', 20, 30, { align: 'center' });
  
  // Main Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('PROJECT COMPLETION REPORT', pageWidth / 2, 25, { align: 'center' });

  yPosition = 60;

  // Project Information
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text(`Project: ${data.projectName}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Project ID: ${data.projectId}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Location: ${data.location}`, margin, yPosition);
  yPosition += 6;
  doc.text(`Duration: ${data.startDate} - ${data.endDate}`, margin, yPosition);
  yPosition += 12;

  // Executive Summary
  yPosition = addSectionHeader('EXECUTIVE SUMMARY', yPosition);
  
  const totalProjectCost = data.labourCosts.totalLabourCost + data.filmUsage.totalFilmCost + data.travelAccommodation.totalTravelAccommodation;
  
  yPosition = addMetricRow('Total Project Cost', `$${totalProjectCost.toLocaleString()}`, yPosition, true);
  yPosition = addMetricRow('Square Footage Completed', `${data.squareFootage.operationsMeasurement.toLocaleString()} sq ft`, yPosition);
  yPosition = addMetricRow('Total Hours Worked', `${data.totalHoursSpent} hours`, yPosition);
  yPosition = addMetricRow('Team Size', `${data.totalPeopleWorked} people`, yPosition);
  yPosition = addMetricRow('Quality Success Rate', `${data.qualityChecks.successRate}%`, yPosition);
  yPosition += 10;

  // Square Footage Analysis
  yPosition = addSectionHeader('SQUARE FOOTAGE ANALYSIS', yPosition);
  
  yPosition = addMetricRow('Sales Estimate', `${data.squareFootage.salesEstimate.toLocaleString()} sq ft`, yPosition);
  yPosition = addMetricRow('Operations Measurement', `${data.squareFootage.operationsMeasurement.toLocaleString()} sq ft`, yPosition);
  yPosition = addMetricRow('Variance', `${data.squareFootage.variance > 0 ? '+' : ''}${data.squareFootage.variance} sq ft`, yPosition);
  yPosition = addMetricRow('Variance Percentage', `${data.squareFootage.variancePercentage > 0 ? '+' : ''}${data.squareFootage.variancePercentage}%`, yPosition);
  yPosition += 10;

  // Labour Cost Breakdown
  yPosition = addSectionHeader('LABOUR COST BREAKDOWN', yPosition);
  
  yPosition = addMetricRow('Total Labour Cost', `$${data.labourCosts.totalLabourCost.toLocaleString()}`, yPosition, true);
  yPosition = addMetricRow('Regular Hours', `${data.labourCosts.regularHours} hrs`, yPosition);
  yPosition = addMetricRow('Overtime Hours', `${data.labourCosts.overtimeHours} hrs`, yPosition);
  yPosition = addMetricRow('Average Hourly Rate', `$${data.labourCosts.hourlyRate}/hr`, yPosition);
  yPosition = addMetricRow('Regular Cost', `$${data.labourCosts.regularCost.toLocaleString()}`, yPosition);
  yPosition = addMetricRow('Overtime Cost', `$${data.labourCosts.overtimeCost.toLocaleString()}`, yPosition);
  yPosition += 10;

  // Film Usage Analysis
  yPosition = addSectionHeader('FILM USAGE & WASTE ANALYSIS', yPosition);
  
  yPosition = addMetricRow('Total Film Used', `${data.filmUsage.totalFilmUsed.toLocaleString()} sq ft`, yPosition);
  yPosition = addMetricRow('Film Waste', `${data.filmUsage.filmWaste} sq ft`, yPosition);
  yPosition = addMetricRow('Film Recut', `${data.filmUsage.filmRecut} sq ft`, yPosition);
  yPosition = addMetricRow('Waste Percentage', `${data.filmUsage.wastePercentage}%`, yPosition);
  yPosition = addMetricRow('Recut Percentage', `${data.filmUsage.recutPercentage}%`, yPosition);
  yPosition = addMetricRow('Total Film Cost', `$${data.filmUsage.totalFilmCost.toLocaleString()}`, yPosition, true);
  yPosition += 10;

  // Travel & Accommodation
  yPosition = addSectionHeader('TRAVEL & ACCOMMODATION COSTS', yPosition);
  
  yPosition = addMetricRow('Travel Costs', `$${data.travelAccommodation.totalTravelCost.toLocaleString()}`, yPosition);
  yPosition = addMetricRow('Accommodation', `$${data.travelAccommodation.accommodationCost.toLocaleString()}`, yPosition);
  yPosition = addMetricRow('Per Diem', `$${data.travelAccommodation.perDiemCost.toLocaleString()}`, yPosition);
  yPosition = addMetricRow('Total Travel & Accommodation', `$${data.travelAccommodation.totalTravelAccommodation.toLocaleString()}`, yPosition, true);
  yPosition = addMetricRow('Team Members Traveled', `${data.travelAccommodation.teamMembersTraveled} people`, yPosition);
  yPosition = addMetricRow('Cost per Person', `$${data.travelAccommodation.averageCostPerPerson.toLocaleString()}`, yPosition);
  yPosition += 10;

  // Quality Summary
  yPosition = addSectionHeader('QUALITY SUMMARY', yPosition);
  
  yPosition = addMetricRow('Windows Passed QC', `${data.qualityChecks.passed} windows`, yPosition);
  yPosition = addMetricRow('Windows Failed QC', `${data.qualityChecks.failed} windows`, yPosition);
  yPosition = addMetricRow('Success Rate', `${data.qualityChecks.successRate}%`, yPosition, true);
  yPosition = addMetricRow('Average Quality Score', `${data.qualityChecks.averageQualityScore}%`, yPosition);
  yPosition += 10;

  // Team Performance
  yPosition = addSectionHeader('TEAM PERFORMANCE', yPosition);
  
  data.teamMembers.forEach((member, index) => {
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }
    
    yPosition = addMetricRow(`${member.name} (${member.role})`, `${member.hoursWorked} hrs | ${member.tasksCompleted} tasks | ${member.qualityScore}% quality`, yPosition);
  });

  // Footer
  const footerY = pageHeight - 30;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(128, 128, 128);
  
  // Company info
  doc.text('Safe Haven Project Management', pageWidth / 2, footerY, { align: 'center' });
  doc.text('123 Business Street, Suite 100 | City, State 12345', pageWidth / 2, footerY + 4, { align: 'center' });
  doc.text('Phone: (555) 123-4567 | Email: info@safehaven.com', pageWidth / 2, footerY + 8, { align: 'center' });
  
  // Generation timestamp
  doc.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, pageWidth / 2, footerY + 14, { align: 'center' });

  return doc;
};
