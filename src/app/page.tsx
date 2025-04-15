"use client";

import { useState } from "react";
import { InferPrayerTimesInput, inferPrayerTimes } from "@/ai/flows/infer-prayer-times";
import { identifyCouncil, IdentifyCouncilInput } from "@/ai/flows/identify-council";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const PrayerTimes = () => {
  const [azanTime, setAzanTime] = useState("");
  const [namazType, setNamazType] = useState<InferPrayerTimesInput["namazType"]>("fajr");
  const [location, setLocation] = useState("");
  const [schoolOfThought, setSchoolOfThought] = useState<InferPrayerTimesInput["schoolOfThought"]>("sunni");
  const [prayerTimes, setPrayerTimes] = useState<{ [key: string]: string | undefined }>({});
  const [council, setCouncil] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();

  const handleConfirm = () => {
    router.push("/weekly-schedule");
  };


  const handlePrayerTimeInference = async () => {
    if (!azanTime || !namazType || !location || !schoolOfThought) {
      toast({
        title: "Error",
        description: "Please fill in all the fields."
      });
      return;
    }

    try {
      const prayerTimesResult = await inferPrayerTimes({
        azanTime,
        namazType,
        location,
        schoolOfThought,
      });

      setPrayerTimes(prayerTimesResult.nextPrayerTimes);

      const councilResult = await identifyCouncil({
        azanTime,
        namazType: namazType as IdentifyCouncilInput["namazType"],
        place: location,
      });

      setCouncil(councilResult.council);

      toast({
        title: "Success",
        description: "Prayer times inferred successfully!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to infer prayer times."
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Card className="w-full max-w-md space-y-4 p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Prayer Seeker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <Label htmlFor="azanTime">Azan Time</Label>
            <Input
              id="azanTime"
              type="time"
              value={azanTime}
              onChange={(e) => setAzanTime(e.target.value)}
              placeholder="Enter azan time"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="namazType">Namaz Type</Label>
            <Select onValueChange={(value) => setNamazType(value as InferPrayerTimesInput["namazType"])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select namaz type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fajr">Fajr</SelectItem>
                <SelectItem value="duhur">Duhur</SelectItem>
                <SelectItem value="asr">Asr</SelectItem>
                <SelectItem value="maghrib">Maghrib</SelectItem>
                <SelectItem value="isha">Isha</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="schoolOfThought">School of Thought</Label>
            <Select onValueChange={(value) => setSchoolOfThought(value as InferPrayerTimesInput["schoolOfThought"])}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select school of thought" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sunni">Sunni</SelectItem>
                <SelectItem value="shia">Shia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80" onClick={handlePrayerTimeInference}>
            Infer Prayer Times
          </Button>
        </CardContent>
      </Card>

      {Object.keys(prayerTimes).length > 0 && (
        <Card className="w-full max-w-md mt-4 p-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center">Next Prayer Times</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(prayerTimes).map(([prayer, time]) => (
              time && <div key={prayer} className="flex justify-between items-center py-2">
                <span className="font-medium capitalize">{prayer}</span>
                <span>{time}</span>
              </div>
            ))}
            {council && (
              <div className="flex justify-between items-center py-2">
                <span className="font-medium">Council:</span>
                <span>{council}</span>
              </div>
            )}
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/80" onClick={handleConfirm}>
              Confirm
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrayerTimes;
