// 'use client';

// import React, { useState } from 'react';
// import { Download, Calendar, ArrowRight, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';

// export default function JobDataDownloader() {
//   const [startDate, setStartDate] = useState<string>('2025-12-01');
//   const [endDate, setEndDate] = useState<string>('2025-12-31');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [success, setSuccess] = useState<boolean>(false);
//   const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
//   const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
//   const [startMonth, setStartMonth] = useState<Date>(new Date(2025, 11));
//   const [endMonth, setEndMonth] = useState<Date>(new Date(2025, 11));

//   const handleDownload = async (): Promise<void> => {
//     if (new Date(startDate) > new Date(endDate)) {
//       alert('วันที่เริ่มต้นต้องน้อยกว่าหรือเท่ากับวันที่สิ้นสุด');
//       return;
//     }

//     setLoading(true);
//     setSuccess(false);
//     try {
//       const response = await fetch('/api/download-job-data', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           startDate: startDate,
//           endDate: endDate,
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('ดาวโหลดไม่สำเร็จ');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `JobData_${startDate}_to_${endDate}.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
      
//       setSuccess(true);
//       setTimeout(() => setSuccess(false), 3000);
//     } catch (error) {
//       alert('เกิดข้อผิดพลาด: ' + (error instanceof Error ? error.message : 'Unknown error'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateThai = (dateString: string): string => {
//     const date = new Date(dateString);
//     const options: Intl.DateTimeFormatOptions = { 
//       year: 'numeric' as const, 
//       month: 'long' as const, 
//       day: 'numeric' as const 
//     };
//     return new Intl.DateTimeFormat('th-TH', options).format(date);
//   };

//   const calculateDays = (): number => {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     const diffTime = Math.abs(end.getTime() - start.getTime());
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//     return diffDays;
//   };

//   const getDaysInMonth = (date: Date): number => {
//     return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (date: Date): number => {
//     return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   };

//   interface DayObject {
//     day: number;
//     isCurrentMonth: boolean;
//   }

//   const generateCalendarDays = (date: Date): DayObject[] => {
//     const daysInMonth = getDaysInMonth(date);
//     const firstDay = getFirstDayOfMonth(date);
//     const days: DayObject[] = [];

//     // Add previous month days
//     const prevMonthDays = getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1));
//     for (let i = firstDay - 1; i >= 0; i--) {
//       days.push({ day: prevMonthDays - i, isCurrentMonth: false });
//     }

//     // Add current month days
//     for (let i = 1; i <= daysInMonth; i++) {
//       days.push({ day: i, isCurrentMonth: true });
//     }

//     // Add next month days
//     const remainingDays = 42 - days.length;
//     for (let i = 1; i <= remainingDays; i++) {
//       days.push({ day: i, isCurrentMonth: false });
//     }

//     return days;
//   };

//   const handleDateClick = (day: number, month: Date, isStart: boolean): void => {
//     const newDate = new Date(month.getFullYear(), month.getMonth(), day);
//     const dateString = newDate.toISOString().split('T')[0];
    
//     if (isStart) {
//       setStartDate(dateString);
//       setShowStartPicker(false);
//     } else {
//       setEndDate(dateString);
//       setShowEndPicker(false);
//     }
//   };

//   const isDateSelected = (day: number, month: Date, dateStr: string): boolean => {
//     const checkDate = new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0];
//     return checkDate === dateStr;
//   };

//   const isDateInRange = (day: number, month: Date): boolean => {
//     const checkDate = new Date(month.getFullYear(), month.getMonth(), day);
//     const start = new Date(startDate);
//     const end = new Date(endDate);
//     return checkDate >= start && checkDate <= end;
//   };

//   interface CalendarPickerProps {
//     month: Date;
//     setMonth: (date: Date) => void;
//     selectedDate: string;
//     isStart: boolean;
//   }

//   const CalendarPicker: React.FC<CalendarPickerProps> = ({ month, setMonth, selectedDate, isStart }) => {
//     const days = generateCalendarDays(month);
//     const monthName = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });
//     const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

//     return (
//       <div className="bg-linear-to-b from-slate-800 to-slate-900 rounded-lg p-5 w-96 shadow-2xl border border-slate-700">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <button
//             onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
//             className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
//           >
//             <ChevronUp className="w-5 h-5 text-white" />
//           </button>
//           <h3 className="text-white font-bold text-lg">{monthName}</h3>
//           <button
//             onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
//             className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
//           >
//             <ChevronDown className="w-5 h-5 text-white" />
//           </button>
//         </div>

//         {/* Day Names */}
//         <div className="grid grid-cols-7 gap-2 mb-3">
//           {dayNames.map((day) => (
//             <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
//               {day}
//             </div>
//           ))}
//         </div>

//         {/* Calendar Days */}
//         <div className="grid grid-cols-7 gap-2">
//           {days.map((dayObj, idx) => {
//             const isSelected = dayObj.isCurrentMonth && isDateSelected(dayObj.day, month, selectedDate);
//             const isInRange = dayObj.isCurrentMonth && isDateInRange(dayObj.day, month);
//             const isToday = dayObj.isCurrentMonth && 
//               new Date(month.getFullYear(), month.getMonth(), dayObj.day).toDateString() === new Date().toDateString();

//             return (
//               <button
//                 key={idx}
//                 onClick={() => {
//                   if (dayObj.isCurrentMonth) {
//                     handleDateClick(dayObj.day, month, isStart);
//                   }
//                 }}
//                 className={`
//                   aspect-square rounded-lg text-sm font-semibold transition-all
//                   ${!dayObj.isCurrentMonth ? 'text-slate-600 opacity-50 cursor-default' : 'cursor-pointer'}
//                   ${isSelected ? 'bg-blue-500 text-white shadow-lg scale-105' : ''}
//                   ${isInRange && !isSelected ? 'bg-blue-500/30 text-white' : ''}
//                   ${!isSelected && !isInRange && dayObj.isCurrentMonth
//                       ? 'text-slate-100 hover:bg-slate-700'
//                       : ''}
//                   ${isToday && !isSelected ? 'border-2 border-blue-400 text-white font-bold' : ''}
//                 `}
//               >
//                 {dayObj.day}
//               </button>
//             );
//           })}
//         </div>

//         {/* Footer Buttons */}
//         <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
//           <button
//             onClick={() => isStart ? setShowStartPicker(false) : setShowEndPicker(false)}
//             className="flex-1 px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
//           >
//             Clear
//           </button>
//           <button
//             onClick={() => {
//               const today = new Date();
//               handleDateClick(today.getDate(), today, isStart);
//             }}
//             className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
//           >
//             Today
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-b from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 flex items-center justify-center">
//       <div className="w-full max-w-2xl">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <div className="bg-linear-to-b from-blue-400 to-purple-500 p-3 rounded-full">
//               <Calendar className="w-8 h-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-white mb-2">ดาวโหลดข้อมูล Smart Porter</h1>
//           <p className="text-purple-200">เลือกช่วงวันที่ที่ต้องการและดาวโหลดเป็นไฟล์ Excel</p>
//         </div>

//         {/* Main Card */}
//         <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
//           <div className="space-y-8">
//             {/* Date Range Section */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Start Date */}
//               <div className="group relative">
//                 <label className="text-sm font-semibold text-purple-600 mb-3 flex items-center">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   วันที่เริ่มต้น
//                 </label>
//                 <button
//                   onClick={() => setShowStartPicker(!showStartPicker)}
//                   className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-50 rounded-lg text-purple-600 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 group-hover:border-opacity-100 font-semibold"
//                 >
//                   {formatDateThai(startDate)}
//                 </button>
//                 {showStartPicker && (
//                   <div className="absolute top-full left-0 mt-3 z-50">
//                     <CalendarPicker 
//                       month={startMonth} 
//                       setMonth={setStartMonth} 
//                       selectedDate={startDate}
//                       isStart={true}
//                     />
//                   </div>
//                 )}
//               </div>

//               {/* End Date */}
//               <div className="group relative">
//                 <label className="text-sm font-semibold text-purple-600 mb-3 flex items-center">
//                   <Calendar className="w-4 h-4 mr-2" />
//                   วันที่สิ้นสุด
//                 </label>
//                 <button
//                   onClick={() => setShowEndPicker(!showEndPicker)}
//                   className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-50 rounded-lg text-purple-500 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 group-hover:border-opacity-100 font-semibold"
//                 >
//                   {formatDateThai(endDate)}
//                 </button>
//                 {showEndPicker && (
//                   <div className="absolute top-full left-0 mt-3 z-50">
//                     <CalendarPicker 
//                       month={endMonth} 
//                       setMonth={setEndMonth} 
//                       selectedDate={endDate}
//                       isStart={false}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Summary Card */}
//             <div className="bg-linear-to-b from-blue-500 to-purple-500 rounded-xl p-6 space-y-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-white font-medium">ช่วงเวลา</span>
//                 <span className="bg-white bg-opacity-20 text-purple-500 px-4 py-2 rounded-full font-semibold">
//                   {calculateDays()} วัน
//                 </span>
//               </div>
              
//               <div className="flex items-center justify-between text-white">
//                 <div>
//                   <p className="text-sm opacity-80 mb-1">ตั้งแต่</p>
//                   <p className="font-semibold text-lg">{formatDateThai(startDate)}</p>
//                 </div>
//                 <ArrowRight className="w-6 h-6 opacity-60" />
//                 <div className="text-right">
//                   <p className="text-sm opacity-80 mb-1">ถึง</p>
//                   <p className="font-semibold text-lg">{formatDateThai(endDate)}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Download Button */}
//             <button
//               onClick={handleDownload}
//               disabled={loading}
//               className="w-full bg-linear-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
//             >
//               {success ? (
//                 <>
//                   <CheckCircle className="w-6 h-6 mr-2" />
//                   ดาวโหลดสำเร็จ!
//                 </>
//               ) : (
//                 <>
//                   <Download className="w-6 h-6 mr-2" />
//                   {loading ? 'กำลังดาวโหลด...' : 'ดาวโหลด Excel'}
//                 </>
//               )}
//             </button>

//             {/* Info Text */}
//             <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
//               <p className="text-xs text-purple-300 text-center">
//                 📊 ไฟล์จะบันทึกเป็น .xlsx พร้อมข้อมูลทั้งหมดในช่วงวันที่ที่เลือก
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-purple-300 text-sm">
//             ✨ ระบบดาวโหลดข้อมูลงาน
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import React, { useState } from 'react';
import { Download, Calendar, ArrowRight, CheckCircle, ChevronUp, ChevronDown } from 'lucide-react';

export default function JobDataDownloader() {
  const [startDate, setStartDate] = useState<string>('2025-12-01');
  const [endDate, setEndDate] = useState<string>('2025-12-31');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showEndPicker, setShowEndPicker] = useState<boolean>(false);
  const [startMonth, setStartMonth] = useState<Date>(new Date(2025, 11));
  const [endMonth, setEndMonth] = useState<Date>(new Date(2025, 11));

  // ฟังก์ชันแปลงวันที่โดยไม่สูญเสียเขตเวลา
  const formatDateToString = (year: number, month: number, day: number): string => {
    const paddedMonth = String(month + 1).padStart(2, '0');
    const paddedDay = String(day).padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  const handleDownload = async (): Promise<void> => {
    if (new Date(startDate) > new Date(endDate)) {
      alert('วันที่เริ่มต้นต้องน้อยกว่าหรือเท่ากับวันที่สิ้นสุด');
      return;
    }

    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch('/api/download-job-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
        }),
      });

      if (!response.ok) {
        throw new Error('ดาวโหลดไม่สำเร็จ');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `JobData_${startDate}_to_${endDate}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const formatDateThai = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric' as const, 
      month: 'long' as const, 
      day: 'numeric' as const 
    };
    return new Intl.DateTimeFormat('th-TH', options).format(date);
  };

  const calculateDays = (): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  interface DayObject {
    day: number;
    isCurrentMonth: boolean;
  }

  const generateCalendarDays = (date: Date): DayObject[] => {
    const daysInMonth = getDaysInMonth(date);
    const firstDay = getFirstDayOfMonth(date);
    const days: DayObject[] = [];

    const prevMonthDays = getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1));
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    return days;
  };

  // แก้ไข: ใช้ formatDateToString แทน toISOString()
  const handleDateClick = (day: number, month: Date, isStart: boolean): void => {
    const dateString = formatDateToString(month.getFullYear(), month.getMonth(), day);
    
    if (isStart) {
      setStartDate(dateString);
      setShowStartPicker(false);
    } else {
      setEndDate(dateString);
      setShowEndPicker(false);
    }
  };

  const isDateSelected = (day: number, month: Date, dateStr: string): boolean => {
    const checkDate = formatDateToString(month.getFullYear(), month.getMonth(), day);
    return checkDate === dateStr;
  };

  const isDateInRange = (day: number, month: Date): boolean => {
    const checkDate = new Date(month.getFullYear(), month.getMonth(), day);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return checkDate >= start && checkDate <= end;
  };

  interface CalendarPickerProps {
    month: Date;
    setMonth: (date: Date) => void;
    selectedDate: string;
    isStart: boolean;
  }

  const CalendarPicker: React.FC<CalendarPickerProps> = ({ month, setMonth, selectedDate, isStart }) => {
    const days = generateCalendarDays(month);
    const monthName = month.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    return (
      <div className="bg-slate-800 bg-opacity-95 rounded-lg p-5 w-96 shadow-2xl border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronUp className="w-5 h-5 text-white" />
          </button>
          <h3 className="text-white font-bold text-lg">{monthName}</h3>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((dayObj, idx) => {
            const isSelected = dayObj.isCurrentMonth && isDateSelected(dayObj.day, month, selectedDate);
            const isInRange = dayObj.isCurrentMonth && isDateInRange(dayObj.day, month);
            const isToday = dayObj.isCurrentMonth && 
              new Date(month.getFullYear(), month.getMonth(), dayObj.day).toDateString() === new Date().toDateString();

            return (
              <button
                key={idx}
                onClick={() => {
                  if (dayObj.isCurrentMonth) {
                    handleDateClick(dayObj.day, month, isStart);
                  }
                }}
                className={`
                  aspect-square rounded-lg text-sm font-semibold transition-all
                  ${!dayObj.isCurrentMonth ? 'text-slate-600 opacity-50 cursor-default' : 'cursor-pointer'}
                  ${isSelected ? 'bg-blue-500 text-white shadow-lg scale-105' : ''}
                  ${isInRange && !isSelected ? 'bg-blue-500/30 text-white' : ''}
                  ${!isSelected && !isInRange && dayObj.isCurrentMonth
                      ? 'text-slate-100 hover:bg-slate-700'
                      : ''}
                  ${isToday && !isSelected ? 'border-2 border-blue-400 text-white font-bold' : ''}
                `}
              >
                {dayObj.day}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6 pt-6 border-t border-slate-700">
          <button
            onClick={() => isStart ? setShowStartPicker(false) : setShowEndPicker(false)}
            className="flex-1 px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => {
              const today = new Date();
              handleDateClick(today.getDate(), today, isStart);
            }}
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Today
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-linear-to-b from-blue-400 to-purple-500 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ดาวโหลดข้อมูล Smart Porter</h1>
          <p className="text-purple-200">เลือกช่วงวันที่ที่ต้องการและดาวโหลดเป็นไฟล์ Excel</p>
        </div>

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group relative">
                <label className="text-sm font-semibold text-purple-600 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  วันที่เริ่มต้น
                </label>
                <button
                  onClick={() => setShowStartPicker(!showStartPicker)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-50 rounded-lg text-purple-600 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 group-hover:border-opacity-100 font-semibold"
                >
                  {formatDateThai(startDate)}
                </button>
                {showStartPicker && (
                  <div className="absolute top-full left-0 mt-3 z-50">
                    <CalendarPicker 
                      month={startMonth} 
                      setMonth={setStartMonth} 
                      selectedDate={startDate}
                      isStart={true}
                    />
                  </div>
                )}
              </div>

              <div className="group relative">
                <label className="text-sm font-semibold text-purple-600 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  วันที่สิ้นสุด
                </label>
                <button
                  onClick={() => setShowEndPicker(!showEndPicker)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-purple-400 border-opacity-50 rounded-lg text-purple-500 text-left focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 group-hover:border-opacity-100 font-semibold"
                >
                  {formatDateThai(endDate)}
                </button>
                {showEndPicker && (
                  <div className="absolute top-full left-0 mt-3 z-50">
                    <CalendarPicker 
                      month={endMonth} 
                      setMonth={setEndMonth} 
                      selectedDate={endDate}
                      isStart={false}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-linear-to-b from-blue-500 to-purple-500 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">ช่วงเวลา</span>
                <span className="bg-white bg-opacity-20 text-purple-500 px-4 py-2 rounded-full font-semibold">
                  {calculateDays()} วัน
                </span>
              </div>
              
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-sm opacity-80 mb-1">ตั้งแต่</p>
                  <p className="font-semibold text-lg">{formatDateThai(startDate)}</p>
                </div>
                <ArrowRight className="w-6 h-6 opacity-60" />
                <div className="text-right">
                  <p className="text-sm opacity-80 mb-1">ถึง</p>
                  <p className="font-semibold text-lg">{formatDateThai(endDate)}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={loading}
              className="w-full bg-linear-to-b from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition duration-200 transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {success ? (
                <>
                  <CheckCircle className="w-6 h-6 mr-2" />
                  ดาวโหลดสำเร็จ!
                </>
              ) : (
                <>
                  <Download className="w-6 h-6 mr-2" />
                  {loading ? 'กำลังดาวโหลด...' : 'ดาวโหลด Excel'}
                </>
              )}
            </button>

            <div className="bg-white bg-opacity-5 rounded-lg p-4 border border-white border-opacity-10">
              <p className="text-xs text-purple-300 text-center">
                📊 ไฟล์จะบันทึกเป็น .xlsx พร้อมข้อมูลทั้งหมดในช่วงวันที่ที่เลือก
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-purple-300 text-sm">
            ✨ ระบบดาวโหลดข้อมูลงาน
          </p>
        </div>
      </div>
    </div>
  );
}