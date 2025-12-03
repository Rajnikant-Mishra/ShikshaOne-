import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Check,
  X,
  AlertCircle,
  Upload,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Calendar } from "../../components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { useToast } from "../../components/ui/use-toast";

// Mock data for students
const initialStudents = [
  {
    id: "1",
    name: "Emma Wilson",
    grade: "10",
    section: "A",
    rollNumber: "1001",
    attendance: {
      "2025-05-19": "present",
      "2025-05-18": "present",
      "2025-05-17": "absent",
      "2025-05-16": "present",
      "2025-05-15": "present",
    },
  },
  {
    id: "2",
    name: "James Rodriguez",
    grade: "10",
    section: "B",
    rollNumber: "1002",
    attendance: {
      "2025-05-19": "present",
      "2025-05-18": "present",
      "2025-05-17": "present",
      "2025-05-16": "late",
      "2025-05-15": "present",
    },
  },
  {
    id: "3",
    name: "Sophia Chen",
    grade: "9",
    section: "A",
    rollNumber: "901",
    attendance: {
      "2025-05-19": "present",
      "2025-05-18": "absent",
      "2025-05-17": "present",
      "2025-05-16": "present",
      "2025-05-15": "present",
    },
  },
  {
    id: "4",
    name: "Ethan Brown",
    grade: "9",
    section: "B",
    rollNumber: "902",
    attendance: {
      "2025-05-19": "late",
      "2025-05-18": "present",
      "2025-05-17": "present",
      "2025-05-16": "absent",
      "2025-05-15": "absent",
    },
  },
  {
    id: "5",
    name: "Olivia Martinez",
    grade: "11",
    section: "A",
    rollNumber: "1101",
    attendance: {
      "2025-05-19": "present",
      "2025-05-18": "present",
      "2025-05-17": "present",
      "2025-05-16": "present",
      "2025-05-15": "present",
    },
  },
  {
    id: "6",
    name: "Noah Johnson",
    grade: "11",
    section: "B",
    rollNumber: "1102",
    attendance: {
      "2025-05-19": "present",
      "2025-05-18": "present",
      "2025-05-17": "late",
      "2025-05-16": "present",
      "2025-05-15": "present",
    },
  },
  {
    id: "7",
    name: "Ava Williams",
    grade: "12",
    section: "A",
    rollNumber: "1201",
    attendance: {
      "2025-05-19": "present",
      "2025-05-18": "present",
      "2025-05-17": "present",
      "2025-05-16": "present",
      "2025-05-15": "late",
    },
  },
  {
    id: "8",
    name: "Liam Smith",
    grade: "12",
    section: "B",
    rollNumber: "1202",
    attendance: {
      "2025-05-19": "absent",
      "2025-05-18": "absent",
      "2025-05-17": "present",
      "2025-05-16": "present",
      "2025-05-15": "present",
    },
  },
];

const Attendance = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    const matchesSection = selectedSection
      ? student.section === selectedSection
      : true;

    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleAttendanceChange = (studentId, status) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: {
                ...student.attendance,
                [formattedDate]: status,
              },
            }
          : student
      )
    );

    toast({
      title: "Attendance updated",
      description: `Marked as ${status} for ${
        students.find((s) => s.id === studentId)?.name
      }`,
    });
  };

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(
      (student) => student.attendance[formattedDate] === "present"
    ).length;
    const absent = filteredStudents.filter(
      (student) => student.attendance[formattedDate] === "absent"
    ).length;
    const late = filteredStudents.filter(
      (student) => student.attendance[formattedDate] === "late"
    ).length;

    return { total, present, absent, late };
  };

  const stats = getAttendanceStats();

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGrade("");
    setSelectedSection("");
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Track and manage student attendance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div> */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            Track and manage student attendance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Calendar Popover */}
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsCalendarOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Export Popover */}
          {/* Export Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4" align="end">
              <div className="flex flex-col gap-2">
                {/* Download Button */}
                <Button
                  className="w-full flex items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: "hsl(221.21deg 83.19% 53.33%)" }}
                  onClick={() => console.log("Download Excel")}
                >
                  <Download className="h-4 w-4 text-white" />
                  Download Excel
                </Button>

                {/* Upload Button */}
                <Button
                  className="w-full flex items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: "hsl(221.21deg 83.19% 53.33%)" }}
                  onClick={() => console.log("Upload Excel")}
                >
                  <Upload className="h-4 w-4 text-white" />
                  Upload Excel
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              For selected class and date
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.present}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? Math.round((stats.present / stats.total) * 100)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.absent}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? Math.round((stats.absent / stats.total) * 100)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {stats.late}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0
                ? Math.round((stats.late / stats.total) * 100)
                : 0}
              % of total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Classes</SelectItem>
              {["9", "10", "11", "12"].map((grade) => (
                <SelectItem key={grade} value={grade}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={resetFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Sheet</CardTitle>
          <CardDescription>
            Mark attendance for {format(selectedDate, "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No students found</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                No students match your search criteria. Try adjusting your
                filters.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-4">Student</div>
                <div className="col-span-2">Class</div>
                <div className="col-span-2">Roll Number</div>
                <div className="col-span-3">Attendance</div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredStudents.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 border-b p-4 items-center"
                  >
                    <div className="col-span-1 font-medium">{index + 1}</div>
                    <div className="col-span-4 font-medium">{student.name}</div>
                    <div className="col-span-2">
                      Grade {student.grade}, Section {student.section}
                    </div>
                    <div className="col-span-2">{student.rollNumber}</div>
                    <div className="col-span-3 flex space-x-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={
                            student.attendance[formattedDate] === "present"
                              ? "default"
                              : "outline"
                          }
                          className={
                            student.attendance[formattedDate] === "present"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                          onClick={() =>
                            handleAttendanceChange(student.id, "present")
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            student.attendance[formattedDate] === "absent"
                              ? "default"
                              : "outline"
                          }
                          className={
                            student.attendance[formattedDate] === "absent"
                              ? "bg-red-500 hover:bg-red-600"
                              : ""
                          }
                          onClick={() =>
                            handleAttendanceChange(student.id, "absent")
                          }
                        >
                          <X className="h-4 w-4 mr-1" />
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={
                            student.attendance[formattedDate] === "late"
                              ? "default"
                              : "outline"
                          }
                          className={
                            student.attendance[formattedDate] === "late"
                              ? "bg-amber-500 hover:bg-amber-600"
                              : ""
                          }
                          onClick={() =>
                            handleAttendanceChange(student.id, "late")
                          }
                        >
                          <AlertCircle className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
