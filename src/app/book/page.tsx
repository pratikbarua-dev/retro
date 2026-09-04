'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sliders,
  Shield,
  AlertCircle,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SchematicMarginDecorations, FullPageSchematicOverlay } from '@/components/ui/ElectronicsDecorations';
import { TimeSlot, Package, CustomPricingRule, Booking } from '@/types';

// Calculate current Bangladesh / UTC+6 Time dynamically
function getUTC6CurrentTime() {
  const now = new Date();
  const utc6Ms = now.getTime() + (now.getTimezoneOffset() * 60000) + (6 * 3600000);
  const d = new Date(utc6Ms);

  const year = d.getFullYear();
  const month = d.getMonth(); // 0-indexed
  const day = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();

  const mm = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
  const dd = day < 10 ? `0${day}` : `${day}`;
  const dateStr = `${year}-${mm}-${dd}`;

  return { year, month, day, hour, minute, dateStr };
}

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPackageParam = searchParams.get('package') || 'pack_custom';

  // Step state (1: Time, 2: Pack, 3: Details, 4: Confirm)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dynamic UTC+6 / Device time state
  const [currentToday, setCurrentToday] = useState(getUTC6CurrentTime());
  const [selectedDate, setSelectedDate] = useState<string>(getUTC6CurrentTime().dateStr);
  const [calendarYear, setCalendarYear] = useState<number>(getUTC6CurrentTime().year);
  const [calendarMonth, setCalendarMonth] = useState<number>(getUTC6CurrentTime().month);


  useEffect(() => {
    // Keep current time synchronized
    const timer = setInterval(() => {
      setCurrentToday(getUTC6CurrentTime());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    // Limit: Do not navigate to months prior to current UTC+6 year & month
    if (calendarYear < currentToday.year || (calendarYear === currentToday.year && calendarMonth <= currentToday.month)) return;
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };


  // Time slots state & mode selection ('preset' | 'range')
  const [timeMode, setTimeMode] = useState<'preset' | 'range'>('preset');
  const [customStartTime, setCustomStartTime] = useState<string>('09:00 AM');
  const [customEndTime, setCustomEndTime] = useState<string>('01:00 PM');
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);

  const START_TIMES = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
  ];

  const END_TIMES = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
    '09:00 PM',
    '10:00 PM',
  ];

  const parseHour = (timeStr: string) => {
    if (!timeStr) return 9;
    const parts = timeStr.split(' ');
    const [h] = parts[0].split(':');
    let val = parseInt(h, 10);
    if (parts[1] === 'PM' && val < 12) val += 12;
    if (parts[1] === 'AM' && val === 12) val = 0;
    return val;
  };

  const handleRangeChange = (newStart: string, newEnd: string) => {
    const startH = parseHour(newStart);
    let endH = parseHour(newEnd);

    // Edge case fix: Auto-adjust end time if <= start time
    if (endH <= startH) {
      const nextAvailableIndex = END_TIMES.findIndex((t) => parseHour(t) > startH);
      if (nextAvailableIndex !== -1) {
        newEnd = END_TIMES[nextAvailableIndex];
        endH = parseHour(newEnd);
      } else {
        newEnd = '10:00 PM';
        endH = 22;
      }
    }

    setCustomStartTime(newStart);
    setCustomEndTime(newEnd);
    const dur = Math.max(1, endH - startH);
    setCustomDuration(dur);
    setSelectedSlot({
      id: `custom_range_${newStart.replace(/[^a-zA-Z0-9]/g, '')}_${newEnd.replace(/[^a-zA-Z0-9]/g, '')}`,
      dayOfWeek: 0,
      startTime: newStart,
      endTime: newEnd,
      capacity: 10,
      bookedSeats: 0,
      isActive: true,
    });
  };



  // Packages & Custom pricing state
  const [packages, setPackages] = useState<Package[]>([]);
  const [customPricingRules, setCustomPricingRules] = useState<CustomPricingRule[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Custom pack builder state
  const [customMembers, setCustomMembers] = useState<number>(6);
  const [customDuration, setCustomDuration] = useState<number>(4);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(900);

  // User details state
  const [formDetails, setFormDetails] = useState({
    customerName: '',
    customerPhone: '',
    institution: 'Daffodil International University',
    departmentBatch: 'SWE, 45th',
    purpose: 'Robotics project / research / learning',
  });

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Check auth to pre-fill details
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setFormDetails((prev) => ({
            ...prev,
            customerName: data.user.name || '',
            customerPhone: data.user.phone || '01712345678',
            institution: data.user.institution || 'Daffodil International University',
            departmentBatch: `${data.user.department || 'SWE'}, ${data.user.batch || '45th'}`,
          }));
        }
      });
  }, []);

  // Fetch slots for selected date
  useEffect(() => {
    setLoadingSlots(true);
    fetch(`/api/slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.slots) {
          setSlots(data.slots);
          if (timeMode === 'preset') {
            const firstAvail = data.slots.find(
              (s: TimeSlot) => (s.capacity - (s.bookedSeats || 0)) > 0
            );
            if (firstAvail) {
              setSelectedSlot(firstAvail);
            }
          } else {
            handleRangeChange(customStartTime, customEndTime);
          }
        }
      })
      .finally(() => setLoadingSlots(false));
  }, [selectedDate]);


  // Fetch packages & custom pricing rules
  useEffect(() => {
    fetch('/api/packages')
      .then((res) => res.json())
      .then((data) => {
        if (data.packages) {
          setPackages(data.packages);
          const initialPkg = data.packages.find((p: Package) => p.id === initialPackageParam) || data.packages[0];
          setSelectedPackage(initialPkg);
        }
        if (data.customPricingRules) {
          setCustomPricingRules(data.customPricingRules);
        }
      });
  }, [initialPackageParam]);

  // Dynamic price calculation whenever custom inputs or package changes
  useEffect(() => {
    if (!selectedPackage) return;

    if (!selectedPackage.isCustom) {
      setCalculatedPrice(selectedPackage.price);
    } else {
      // Find matching rule in matrix
      const rule = customPricingRules.find(
        (r) => r.members === customMembers && r.duration === customDuration
      );

      if (rule) {
        setCalculatedPrice(rule.price);
      } else {
        // Fallback formula: 120 per member per 2h slot
        const slotsCount = Math.ceil(customDuration / 2);
        setCalculatedPrice(customMembers * slotsCount * 120);
      }
    }
  }, [selectedPackage, customMembers, customDuration, customPricingRules]);

  // Number of effective members based on package
  const effectiveMembers = selectedPackage?.isCustom
    ? customMembers
    : selectedPackage?.minMembers || 1;

  // Duration based on package
  const effectiveDuration = selectedPackage?.isCustom
    ? customDuration
    : selectedPackage?.defaultDuration || 2;

  // Handlers for step progression
  const handleNextStep = () => {
    setErrorMsg(null);
    if (currentStep === 1) {
      if (!selectedSlot) {
        setErrorMsg('Please select an available time slot.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedPackage) {
        setErrorMsg('Please select a booking package.');
        return;
      }
      // Check remaining capacity against selected members
      const remainingSeats = selectedSlot
        ? selectedSlot.capacity - (selectedSlot.bookedSeats || 0)
        : 10;

      if (effectiveMembers > remainingSeats) {
        setErrorMsg(`Only ${remainingSeats} seat${remainingSeats === 1 ? '' : 's'} remain in this time slot. You requested ${effectiveMembers} members.`);
        return;
      }

      setCurrentStep(3);
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formDetails.customerName.trim() || !formDetails.customerPhone.trim() || !formDetails.institution.trim()) {
      setErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    const cleanPhone = formDetails.customerPhone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 6) {
      setErrorMsg('Please enter a valid phone number with at least 6 digits.');
      return;
    }

    if (!selectedSlot || !selectedPackage) return;

    setIsSubmitting(true);

    try {
      // Use selectedSlot.endTime directly for exact time representation
      const endTimeStr = selectedSlot.endTime || '01:00 PM';

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingDate: selectedDate,
          startTime: selectedSlot.startTime,
          endTime: endTimeStr,
          duration: effectiveDuration,
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          members: effectiveMembers,
          purpose: formDetails.purpose || 'Lab workspace session',
          customerName: formDetails.customerName,
          customerPhone: formDetails.customerPhone,
          institution: formDetails.institution,
          departmentBatch: formDetails.departmentBatch || 'SWE, 45th',
        }),
      });


      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to submit booking.');
        return;
      }

      setConfirmedBooking(data.booking);
      setCurrentStep(4);
    } catch (err) {
      setErrorMsg('Network error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#0066FF] selection:text-white">
      <Navbar />

      <main className="flex-grow py-10 relative overflow-hidden bg-blueprint">
        <SchematicMarginDecorations />
        <FullPageSchematicOverlay />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* ==================================================
              TOP PROGRESS STEPPER
          ================================================== */}
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 w-full z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#0066FF] transition-all duration-300 z-0"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              />

              {[
                { num: 1, label: 'Select Time' },
                { num: 2, label: 'Choose Pack' },
                { num: 3, label: 'Your Details' },
                { num: 4, label: 'Confirm' },
              ].map((step) => {
                const isDone = currentStep > step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-sm transition-colors border-2 ${
                        isDone
                          ? 'bg-[#0066FF] text-white border-[#0066FF]'
                          : isCurrent
                          ? 'bg-white text-[#0066FF] border-[#0066FF] shadow-md ring-4 ring-blue-100'
                          : 'bg-white text-slate-400 border-slate-300'
                      }`}
                    >
                      {isDone ? <Check className="w-5 h-5 stroke-[3]" /> : step.num}
                    </div>
                    <span
                      className={`text-xs font-mono mt-2 font-medium ${
                        isCurrent ? 'text-[#0066FF] font-bold' : isDone ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ERROR ALERT */}
          {errorMsg && (
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ==================================================
              STEP 1 — SELECT DATE & TIME
          ================================================== */}
          {currentStep === 1 && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <Badge variant="blue" className="mb-2">
                  :: STEP 01 ::
                </Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  SELECT DATE & TIME
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Choose an available date and time slot for your workspace session.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: DYNAMIC CALENDAR SELECTOR */}
                <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono font-bold text-slate-900 text-base flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-[#0066FF]" />
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </h3>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={calendarYear === 2025 && calendarMonth <= 7}
                        className="p-1.5 rounded border text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono font-bold cursor-pointer"
                      >
                        &lt;
                      </button>
                      <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-1.5 rounded border text-slate-600 hover:bg-slate-100 text-xs font-mono font-bold cursor-pointer"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>

                  {/* WEEKDAY HEADERS */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono mb-2 text-slate-400">
                    <div>SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div>
                  </div>

                  {/* DYNAMIC DAYS GRID */}
                  <div className="grid grid-cols-7 gap-1 text-center text-sm font-mono">
                    {/* Blank offset slots for first day of month */}
                    {Array.from({ length: new Date(calendarYear, calendarMonth, 1).getDay() }).map((_, idx) => (
                      <div key={`blank_${idx}`} className="py-2" />
                    ))}

                    {/* Day buttons */}
                    {Array.from(
                      { length: new Date(calendarYear, calendarMonth + 1, 0).getDate() },
                      (_, i) => {
                        const dayNum = i + 1;
                        const mm = calendarMonth + 1 < 10 ? `0${calendarMonth + 1}` : `${calendarMonth + 1}`;
                        const dd = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
                        const dateStr = `${calendarYear}-${mm}-${dd}`;
                        const isPast = dateStr < currentToday.dateStr;

                        const isSelected = selectedDate === dateStr;

                        return (
                          <button
                            key={dayNum}
                            disabled={isPast}
                            onClick={() => !isPast && setSelectedDate(dateStr)}
                            className={`py-2 rounded-lg font-medium text-xs transition-colors cursor-pointer ${
                              isPast
                                ? 'opacity-30 cursor-not-allowed bg-slate-50 text-slate-400'
                                : isSelected
                                ? 'bg-[#0066FF] text-white font-bold shadow-xs'
                                : 'hover:bg-blue-50 hover:text-[#0066FF] text-slate-700 font-bold'
                            }`}
                          >
                            {dayNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-mono text-slate-600 flex items-center justify-between">
                    <span>Selected Date:</span>
                    <span className="font-bold text-[#0066FF]">
                      {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>


                {/* RIGHT: TIME SLOTS & TIME RANGE SELECTOR */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h3 className="font-mono font-bold text-slate-900 text-base flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#0066FF]" />
                      SELECT TIME & DURATION
                    </h3>

                    {/* MODE SWITCHER TABS */}
                    <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-mono border border-slate-200">
                      <button
                        type="button"
                        onClick={() => {
                          setTimeMode('preset');
                          if (slots.length > 0) setSelectedSlot(slots[0]);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          timeMode === 'preset'
                            ? 'bg-white text-[#0066FF] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Standard Slots
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTimeMode('range');
                          handleRangeChange(customStartTime, customEndTime);
                        }}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          timeMode === 'range'
                            ? 'bg-white text-[#0066FF] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Custom Time Range
                      </button>
                    </div>
                  </div>

                  {/* PRESET TIME SLOTS VIEW */}
                  {timeMode === 'preset' ? (
                    loadingSlots ? (
                      <div className="py-12 text-center text-slate-400 font-mono text-xs">
                        Loading available slots...
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {slots.map((slot) => {
                          const isSelectedDateToday = selectedDate === currentToday.dateStr;
                          const slotStartHour = parseHour(slot.startTime);
                          const isPastTimeSlot = isSelectedDateToday && slotStartHour <= currentToday.hour;

                          const remaining = slot.capacity - (slot.bookedSeats || 0);
                          const isFull = remaining <= 0;
                          const isUnavailable = isFull || isPastTimeSlot;
                          const isSelected = selectedSlot?.id === slot.id;

                          return (
                            <div
                              key={slot.id}
                              onClick={() => !isUnavailable && setSelectedSlot(slot)}
                              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                                isUnavailable
                                  ? 'bg-slate-50 border-slate-200 opacity-50 cursor-not-allowed'
                                  : isSelected
                                  ? 'bg-blue-50/50 border-[#0066FF] shadow-xs cursor-pointer'
                                  : 'bg-white border-slate-200 hover:border-blue-300 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    isUnavailable
                                      ? 'border-slate-300 bg-slate-100'
                                      : isSelected
                                      ? 'border-[#0066FF] bg-[#0066FF]'
                                      : 'border-slate-300'
                                  }`}
                                >
                                  {isSelected && !isUnavailable && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                  )}
                                </div>
                                <div>
                                  <div className={`font-mono font-bold text-sm ${isUnavailable ? 'text-slate-400' : 'text-slate-900'}`}>
                                    {slot.startTime} – {slot.endTime}
                                  </div>
                                  <div className="text-xs text-slate-500 font-mono">
                                    Standard 2 Hours
                                  </div>
                                </div>
                              </div>

                              <div>
                                {isPastTimeSlot ? (
                                  <Badge variant="red">PAST / EXPIRED</Badge>
                                ) : isFull ? (
                                  <Badge variant="red">FULL</Badge>
                                ) : (
                                  <Badge
                                    variant={remaining <= 3 ? 'amber' : 'green'}
                                  >
                                    {remaining} seats left
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  ) : (
                    /* CUSTOM TIME RANGE SELECTOR VIEW */
                    <div className="space-y-5 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      {selectedDate === currentToday.dateStr && START_TIMES.filter((t) => parseHour(t) > currentToday.hour).length === 0 ? (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono text-amber-800 leading-relaxed">
                          :: NOTICE: All workspace time slots for today have ended. Please select tomorrow or a future date on the calendar.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* START TIME SELECT */}
                          <div>
                            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                              START TIME:
                            </label>
                            <select
                              value={customStartTime}
                              onChange={(e) => handleRangeChange(e.target.value, customEndTime)}
                              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100"
                            >
                              {START_TIMES.filter((t) => {
                                if (selectedDate !== currentToday.dateStr) return true;
                                return parseHour(t) > currentToday.hour;
                              }).map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* END TIME SELECT */}
                          <div>
                            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5">
                              END TIME:
                            </label>
                            <select
                              value={customEndTime}
                              onChange={(e) => handleRangeChange(customStartTime, e.target.value)}
                              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100"
                            >
                              {END_TIMES.filter((t) => parseHour(t) > parseHour(customStartTime)).map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}


                      {/* SUMMARY BADGE */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between font-mono text-xs">
                        <div className="space-y-1">
                          <div className="font-bold text-[#0066FF]">SELECTED TIME RANGE:</div>
                          <div className="text-slate-800 text-sm font-bold">
                            {customStartTime} – {customEndTime}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-[#0066FF] text-white font-bold rounded-lg text-xs">
                            {Math.max(1, parseHour(customEndTime) - parseHour(customStartTime))} Hours
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <Button variant="primary" size="lg" onClick={handleNextStep}>
                      Next: Choose Pack →
                    </Button>
                  </div>
                </div>

              </div>

              {/* INFORMATIONAL CARDS BELOW */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#0066FF] shrink-0" />
                  <span>Each standard slot is 2 hours</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#0066FF] shrink-0" />
                  <span>Maximum 10 members per booking</span>
                </div>
                <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#0066FF] shrink-0" />
                  <span>Advance booking recommended</span>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP 2 — CHOOSE YOUR PACK
          ================================================== */}
          {currentStep === 2 && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <Badge variant="blue" className="mb-2">
                  :: STEP 02 ::
                </Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  CHOOSE YOUR PACK
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Select a predefined pack or build a custom session tailored for your team.
                </p>
              </div>

              {/* PACKAGE SELECTION CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((pkg) => {
                  const isSelected = selectedPackage?.id === pkg.id;

                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-white border-[#0066FF] shadow-lg ring-4 ring-blue-100'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono font-extrabold text-slate-900 text-lg">
                            {pkg.name}
                          </span>
                          {pkg.isCustom ? (
                            <Badge variant="blue">CUSTOM</Badge>
                          ) : (
                            <Badge variant="outline">
                              {pkg.minMembers} {pkg.minMembers === 1 ? 'Person' : 'Persons'}
                            </Badge>
                          )}
                        </div>

                        {pkg.isCustom ? (
                          <p className="text-xs text-slate-500 mb-4">
                            Build a session that fits your project. 1–10 members & custom duration.
                          </p>
                        ) : (
                          <div className="mb-4">
                            <span className="text-2xl font-extrabold text-slate-900">৳{pkg.price}</span>
                            <span className="text-xs text-slate-500 font-mono"> / 2 hrs</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-500">
                          {isSelected ? 'Selected ✓' : 'Click to select'}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#0066FF] bg-[#0066FF]' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* DETAILED CUSTOM PACK BUILDER PANEL */}
              {selectedPackage?.isCustom && (
                <div className="bg-white rounded-2xl p-6 border-2 border-[#0066FF] shadow-md space-y-6 tech-corner-box">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg font-extrabold font-mono text-slate-900 flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-[#0066FF]" />
                        CUSTOM PACK CALCULATOR
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Adjust team size and session duration for live price updates.
                      </p>
                    </div>
                    <Badge variant="blue">LIVE CALCULATOR</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* NUMBER OF MEMBERS CONTROL */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                        Number of Members (1 – 10)
                      </label>
                      <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setCustomMembers(Math.max(1, customMembers - 1))}
                          className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-lg"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-2xl font-extrabold font-mono text-slate-900 min-w-[40px] text-center">
                          {customMembers}
                        </span>
                        <button
                          type="button"
                          onClick={() => setCustomMembers(Math.min(10, customMembers + 1))}
                          className="w-10 h-10 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center text-lg"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-slate-500 font-mono ml-auto">
                          Maximum 10 members
                        </span>
                      </div>
                    </div>

                    {/* DURATION CONTROL & TIME RANGE OPTIONS */}
                    <div className="space-y-3">
                      <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                        Session Time Range & Duration
                      </label>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 mb-1">Start Time</label>
                          <select
                            value={customStartTime}
                            onChange={(e) => handleRangeChange(e.target.value, customEndTime)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                          >
                            {START_TIMES.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-500 mb-1">End Time</label>
                          <select
                            value={customEndTime}
                            onChange={(e) => handleRangeChange(customStartTime, e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                          >
                            {END_TIMES.filter((t) => parseHour(t) > parseHour(customStartTime)).map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[1, 2, 3, 4, 6, 8, 10, 12].map((hrs) => (
                          <button
                            key={hrs}
                            type="button"
                            onClick={() => setCustomDuration(hrs)}
                            className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                              customDuration === hrs
                                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                            }`}
                          >
                            {hrs}h
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>


                  {/* LIVE PRICING BREAKDOWN DISPLAY */}
                  <div className="p-4 bg-blue-50/80 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs font-mono text-blue-700 font-semibold">
                        PRICING BREAKDOWN:
                      </div>
                      <div className="text-sm font-mono text-slate-800">
                        {customDuration} hours × {customMembers} members
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-500">TOTAL COST: </span>
                      <span className="text-3xl font-extrabold text-[#0066FF] font-mono">
                        ৳{calculatedPrice}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" size="lg" onClick={() => setCurrentStep(1)}>
                  ← Back to Slots
                </Button>
                <Button variant="primary" size="lg" onClick={handleNextStep}>
                  Next: Enter Details →
                </Button>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP 3 — USER DETAILS & SUMMARY
          ================================================== */}
          {currentStep === 3 && (
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center max-w-2xl mx-auto">
                <Badge variant="blue" className="mb-2">
                  :: STEP 03 ::
                </Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                  YOUR DETAILS
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Enter member details to finalize your workspace reservation.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT: FORM INPUTS */}
                <form
                  onSubmit={handleConfirmBooking}
                  className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
                >
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Pratik Barua"
                      value={formDetails.customerName}
                      onChange={(e) => setFormDetails({ ...formDetails, customerName: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="017XXXXXXXX"
                      value={formDetails.customerPhone}
                      onChange={(e) => setFormDetails({ ...formDetails, customerPhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Daffodil International University"
                        value={formDetails.institution}
                        onChange={(e) => setFormDetails({ ...formDetails, institution: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                        Department / Batch *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="SWE, 45th"
                        value={formDetails.departmentBatch}
                        onChange={(e) => setFormDetails({ ...formDetails, departmentBatch: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Purpose *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Robotics project / research / learning"
                      value={formDetails.purpose}
                      onChange={(e) => setFormDetails({ ...formDetails, purpose: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
                      Number of Members
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`${effectiveMembers} Member${effectiveMembers > 1 ? 's' : ''} (From package selection)`}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <Button variant="outline" size="lg" type="button" onClick={() => setCurrentStep(2)}>
                      ← Back
                    </Button>
                    <Button variant="primary" size="lg" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Confirming...' : 'Confirm Booking ✓'}
                    </Button>
                  </div>
                </form>

                {/* RIGHT: BOOKING SUMMARY STICKY */}
                <div className="lg:col-span-5">
                  <div className="bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-md sticky top-24 space-y-4 tech-corner-box">
                    <h3 className="font-mono font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3 uppercase">
                      BOOKING SUMMARY
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-mono">Date:</span>
                        <span className="font-bold text-slate-900">Sun, 30 Aug 2025</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-mono">Time Slot:</span>
                        <span className="font-bold text-slate-900">{selectedSlot?.startTime} – {selectedSlot?.endTime}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-mono">Duration:</span>
                        <span className="font-bold text-slate-900">{effectiveDuration} hours</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-mono">Members:</span>
                        <span className="font-bold text-slate-900">{effectiveMembers} Members</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-mono">Package:</span>
                        <span className="font-bold text-[#0066FF] font-mono">{selectedPackage?.name}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-base">TOTAL DUE:</span>
                      <span className="text-3xl font-extrabold text-[#0066FF] font-mono">
                        ৳{calculatedPrice}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono bg-blue-50 p-2.5 rounded border border-blue-200">
                      ✓ Free cancellation up to 4 hours prior.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              STEP 4 — CONFIRMATION SCREEN
          ================================================== */}
          {currentStep === 4 && confirmedBooking && (
            <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 border-2 border-emerald-500 shadow-xl space-y-6 text-center tech-corner-box">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <Badge variant="green" className="mb-2">
                  :: SYSTEM STATUS: BOOKED ::
                </Badge>
                <h1 className="text-3xl font-extrabold text-slate-900 font-mono">
                  BOOKING CONFIRMED!
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Your bench slot has been successfully reserved in Retro Lab.
                </p>
              </div>

              {/* BOOKING DETAILS CARD */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left max-w-xl mx-auto space-y-3 font-mono text-xs text-slate-700">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Booking ID:</span>
                  <span className="font-bold text-[#0066FF] text-sm">{confirmedBooking.bookingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.bookingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.startTime} – {confirmedBooking.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Members:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.members} Members</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                  <span className="text-slate-500">Total Price:</span>
                  <span className="font-extrabold text-[#0066FF]">৳{confirmedBooking.totalPrice}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Go to Home
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="primary" size="lg">
                    View My Bookings →
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono text-xs text-slate-500">Loading Retro Lab Engine...</div>}>
      <BookingContent />
    </Suspense>
  );
}
