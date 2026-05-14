import React, { useState } from 'react'
import { jsPDF } from "jspdf";
import InfoIcon from '/src/assets/icons/Info.svg?react'
import { useCategories, type CategoriesContextType } from '../contexts/CategoryContext';
import type { Category } from '../api/CategoryService';
import ReportPage from './ReportPage';
import html2canvas from 'html2canvas';
function Reports() {
  const { categories } = useCategories() as CategoriesContextType;
  const [months,setMonths] = useState(12);
  const [types,setTypes] = useState('both');
  const [categoriesPDF,setCategoriesPDF] = useState('all');
  const [generating, setGenerating] = useState(false);
  
const generatePDF = async () => {
  const element = document.getElementById("report-content");
  if (!element) return;

  const canvas = await html2canvas(element, {
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position -= pageHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save("report.pdf");
  setGenerating(false);
};

  return (<>
    <div className='min-h-full w-full p-10 inter'>
      <div className='flex sm:flex-row flex-col justify-between sm:items-center items-left gap-6 mb-20'>
        <p className='mont_semibold text-4xl'>Reports</p>
        <button 
        onClick={() => {setGenerating(true);generatePDF()} }
        disabled={generating}
        className=" inter relative w-50 h-10 bg-primary text-white rounded-full overflow-hidden group cursor-pointer shadow-md">
          <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
            Generate PDF
          </span>
          <span className="absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            Generate
          </span>
        </button>
      </div>
      {/* OPTIONS */}
      <div>
        <div className='p-5 bg-[#84a2eb2a] rounded-2xl w-full mb-4'>
          <p className='relative flex gap-2 w-full'><InfoIcon />  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi molestias, totam tenetur assumenda porro quia quidem maiores consequuntur distinctio ducimus eum. Aspernatur officia sapiente doloribus esse error rem eaque quis.</p>
        </div>

        <div className='p-5 border border-gray-300 rounded-2xl' >
          <label >Months: </label>
          <select onChange={(e) => setMonths(Number(e.currentTarget.value))} defaultValue={12}>
            <option value="12">12 months</option>
            <option value="9">9 months</option>
            <option value="6">6 months</option>
            <option value="3">3 months</option>
          </select>

          <label >Incomes & outcomes</label>
          <select onChange={(e) => setTypes(e.currentTarget.value)} >
            <option value="both">Both</option>
            <option value="incomes">Incomes</option>
            <option value="outcomes">Outcomes</option>            
          </select>
          
          <label >Categories</label>
          <select onChange={(e) => setCategoriesPDF(e.currentTarget.value)}>
            <option value="all">All</option>
            <option value="none">None</option>
          </select>
        </div>

        <p className='inter text-2xl text-gray-600 mt-5'>Previsualización</p>
        <div className='border border-gray-300 rounded-2xl'>  
          <ReportPage monthCounter={months} types={types} categories={categoriesPDF} />
        </div>
      </div>
    </div>
    {generating &&
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-md">
        
        <div className="flex flex-col items-center gap-4 px-8 py-6 rounded-2xl bg-white/90 shadow-2xl border border-black/10">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800">
              Generando tu informe
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Esto puede tardar unos segundos...
            </p>
          </div>

        </div>
      </div>
    }
    </>
  )
}

export default Reports