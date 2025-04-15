"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const WeeklySchedule = () => {
  // Placeholder data for prayer times - replace with actual data fetching or generation
  const weeklyPrayerData = [
    { day: "Sunday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
    { day: "Monday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
    { day: "Tuesday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
    { day: "Wednesday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
    { day: "Thursday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
    { day: "Friday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
    { day: "Saturday", fajr: "6:00 AM", dhuhr: "1:00 PM", asr: "4:30 PM", maghrib: "6:15 PM", isha: "8:00 PM" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md space-y-4 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Weekly Prayer Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weeklyPrayerData.map((dayData, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">{dayData.day}</h3>
              <div className="grid grid-cols-2 gap-2">
                <span>Fajr: {dayData.fajr}</span>
                <span>Dhuhr: {dayData.dhuhr}</span>
                <span>Asr: {dayData.asr}</span>
                <span>Maghrib: {dayData.maghrib}</span>
                <span>Isha: {dayData.isha}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklySchedule;
