import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useToast } from "../components/ui/use-toast";

// Mock data for students
const initialStudents = [
  {
    id: "1",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    grade: "10",
    section: "A",
    rollNumber: "1001",
    gender: "Female",
    status: "Active",
    attendance: "95%",
    avatar: "",
  },
  {
    id: "2",
    name: "James Rodriguez",
    email: "james.r@example.com",
    grade: "10",
    section: "B",
    rollNumber: "1002",
    gender: "Male",
    status: "Active",
    attendance: "88%",
    avatar: "",
  },
  {
    id: "3",
    name: "Sophia Chen",
    email: "sophia.c@example.com",
    grade: "9",
    section: "A",
    rollNumber: "901",
    gender: "Female",
    status: "Active",
    attendance: "92%",
    avatar: "",
  },
  {
    id: "4",
    name: "Ethan Brown",
    email: "ethan.b@example.com",
    grade: "9",
    section: "B",
    rollNumber: "902",
    gender: "Male",
    status: "Inactive",
    attendance: "78%",
    avatar: "",
  },
  {
    id: "5",
    name: "Olivia Martinez",
    email: "olivia.m@example.com",
    grade: "11",
    section: "A",
    rollNumber: "1101",
    gender: "Female",
    status: "Active",
    attendance: "97%",
    avatar: "",
  },
  {
    id: "6",
    name: "Noah Johnson",
    email: "noah.j@example.com",
    grade: "11",
    section: "B",
    rollNumber: "1102",
    gender: "Male",
    status: "Active",
    attendance: "91%",
    avatar: "",
  },
  {
    id: "7",
    name: "Ava Williams",
    email: "ava.w@example.com",
    grade: "12",
    section: "A",
    rollNumber: "1201",
    gender: "Female",
    status: "Active",
    attendance: "94%",
    avatar: "",
  },
  {
    id: "8",
    name: "Liam Smith",
    email: "liam.s@example.com",
    grade: "12",
    section: "B",
    rollNumber: "1202",
    gender: "Male",
    status: "Inactive",
    attendance: "82%",
    avatar: "",
  },
];

const Students = () => {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    grade: "",
    section: "",
    rollNumber: "",
    gender: "",
    status: "Active",
  });

  const { toast } = useToast();
  const itemsPerPage = 6;
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedImage(file);
      handleSelectChange("student_image", file);
    }
  };

  // Filter students based on search and filters
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    const matchesSection = selectedSection
      ? student.section === selectedSection
      : true;
    const matchesStatus = selectedStatus
      ? student.status === selectedStatus
      : true;

    return matchesSearch && matchesGrade && matchesSection && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddStudent = () => {
    if (
      !newStudent.name ||
      !newStudent.email ||
      !newStudent.grade ||
      !newStudent.section ||
      !newStudent.rollNumber
    ) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const id = (students.length + 1).toString();
    const studentWithId = { ...newStudent, id, attendance: "0%", avatar: "" };

    setStudents([...students, studentWithId]);
    setNewStudent({
      name: "",
      email: "",
      grade: "",
      section: "",
      rollNumber: "",
      gender: "",
      status: "Active",
    });

    setIsAddDialogOpen(false);

    toast({
      title: "Student added",
      description: `${newStudent.name} has been added successfully.`,
    });
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;

    setStudents(
      students.filter((student) => student.id !== studentToDelete.id)
    );
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);

    toast({
      title: "Student removed",
      description: "The student has been removed successfully.",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewStudent({ ...newStudent, [name]: value });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGrade("");
    setSelectedSection("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Students</h2>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>

        {/* //student form  */}
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            {/* <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
                <DialogDescription>
                  Enter the details of the new student below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newStudent.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newStudent.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Password</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newStudent.name}
                      onChange={handleInputChange}
                      placeholder="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Role</Label>
                    <Select
                      value={newStudent.section}
                      onValueChange={(value) =>
                        handleSelectChange("section", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {["admin", "teacher", "student"].map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={newStudent.grade}
                      onValueChange={(value) =>
                        handleSelectChange("grade", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[9, 10, 11, 12].map((grade) => (
                          <SelectItem key={grade} value={grade.toString()}>
                            Grade {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Select
                      value={newStudent.section}
                      onValueChange={(value) =>
                        handleSelectChange("section", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C"].map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Mobile Number</Label>
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      value={newStudent.rollNumber}
                      onChange={handleInputChange}
                      placeholder="mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={newStudent.gender}
                      onValueChange={(value) =>
                        handleSelectChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newStudent.dob}
                      onChange={(e) =>
                        handleSelectChange("dob", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newStudent.status}
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddStudent}>Add Student</Button>
              </DialogFooter>
            </DialogContent> */}
            <DialogContent className="sm:max-w-[1000px]">
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Cards */}
                <div className="grid grid-cols-1 gap-4 lg:w-1/3">
                  {/* Upload Image */}
                  <div
                    className="p-4 rounded-lg border-2 border-dashed border-gray-400 flex flex-col items-center justify-center gap-2 h-40 w-full cursor-pointer relative"
                    onClick={() =>
                      document.getElementById("student-image-input").click()
                    }
                  >
                    <input
                      type="file"
                      id="student-image-input"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {!uploadedImage ? (
                      <p className="text-gray-600 text-sm">
                        Click to upload image
                      </p>
                    ) : (
                      <img
                        src={URL.createObjectURL(uploadedImage)}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    )}
                  </div>

                  {/* Parent / Guardian */}
                  <div className="p-4 rounded-lg border shadow-sm space-y-2">
                    <h3 className="text-sm font-semibold">Parent / Guardian</h3>
                    <Input
                      name="parent_name"
                      placeholder="Name"
                      value={newStudent.parent_name}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="parent_email"
                      placeholder="Email"
                      value={newStudent.parent_email}
                      onChange={handleInputChange}
                    />
                    <Input
                      name="parent_mobile"
                      placeholder="Mobile"
                      value={newStudent.parent_mobile}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Actions */}
                  <div className="p-4 rounded-lg border shadow-sm space-y-2">
                    <h3 className="text-sm font-semibold">Actions</h3>
                    <div className="flex flex-col gap-2">
                      {["send_sms", "send_email", "set_temp_password"].map(
                        (field) => (
                          <label
                            key={field}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={newStudent[field] || false}
                              onChange={(e) =>
                                handleSelectChange(field, e.target.checked)
                              }
                            />
                            {field === "send_sms"
                              ? "Send SMS OTP"
                              : field === "send_email"
                              ? "Send Email Link"
                              : "Set Temporary Password"}
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Form */}
                <div className="lg:w-2/3 mt-4 lg:mt-0">
                  <div className="grid gap-4 py-4">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input
                          name="student_first_name"
                          value={newStudent.student_first_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input
                          name="student_last_name"
                          value={newStudent.student_last_name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* DOB & Admission Date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>DOB</Label>
                        <Input
                          name="dob"
                          type="date"
                          value={newStudent.dob}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Admission Date</Label>
                        <Input
                          name="admission_date"
                          type="date"
                          value={newStudent.admission_date}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Section & Roll Number */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Class</Label>
                        <Select
                          value={newStudent.section}
                          onValueChange={(value) =>
                            handleSelectChange("section", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {["01", "02", "03"].map((section) => (
                              <SelectItem key={section} value={section}>
                                Class {section}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Roll Number</Label>
                        <Input
                          name="aadhaar_card"
                          value={newStudent.aadhaar_card}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    {/* Medical Notes */}
                    <div className="space-y-2">
                      <Label>Medical Notes</Label>
                      <textarea
                        id="l12"
                        placeholder="Enter details..."
                        value={newStudent.l12 || ""}
                        onChange={(e) =>
                          handleSelectChange("l12", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-200 p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Student ID Card */}
                    <div className="p-4 mt-2 rounded-lg border shadow-sm flex items-center gap-2">
                      <Label className="text-sm font-medium w-24">
                        Student ID
                      </Label>
                      <span className="flex-1 p-2 border rounded-md bg-gray-50 text-gray-700">
                        {newStudent.student_id || "STU-001-AD-001"}
                      </span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            newStudent.student_id || "STU-001-AD-001"
                          );
                          alert("Student ID copied!");
                        }}
                      >
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => alert("Edit Student ID")}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => console.log("Add student logic")}>
                  Add Student
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* //stduent serach  */}
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
              <SelectItem value="">All Grades</SelectItem>
              {["9", "10", "11", "12"].map((grade) => (
                <SelectItem key={grade} value={grade}>
                  Grade {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSection} onValueChange={setSelectedSection}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sections</SelectItem>
              {["A", "B"].map((section) => (
                <SelectItem key={section} value={section}>
                  Section {section}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={resetFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No students found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              No students match your search criteria. Try adjusting your filters
              or add a new student.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Student
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedStudents.map((student) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          student.status === "Active" ? "default" : "outline"
                        }
                      >
                        {student.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Student
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              setStudentToDelete(student);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Student
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={student.avatar} />
                        <AvatarFallback className="text-lg">
                          {student.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {student.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Grade</p>
                        <p className="font-medium">{student.grade}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Section</p>
                        <p className="font-medium">{student.section}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Roll Number</p>
                        <p className="font-medium">{student.rollNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Attendance</p>
                        <p className="font-medium">{student.attendance}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-3">
                    <Button variant="ghost" className="w-full">
                      View Full Profile
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this student? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {studentToDelete && (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {studentToDelete.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{studentToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Grade {studentToDelete.grade}, Section{" "}
                    {studentToDelete.section}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   Search,
//   Plus,
//   Download,
//   MoreHorizontal,
//   Edit,
//   Trash,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   X,
// } from "lucide-react";
// import { Button } from "../components/ui/button";
// import { Input } from "../components/ui/input";
// import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
// import { Badge } from "../components/ui/badge";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
// import { Label } from "../components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
// import { useToast } from "../components/ui/use-toast";
// import axios from "axios";
// import { API_BASE_URL } from "../components/ApiConfig/ApiConfig";

// const Students = () => {
//   const { toast } = useToast();
//   const itemsPerPage = 6;

//   const [students, setStudents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [selectedSection, setSelectedSection] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [studentToDelete, setStudentToDelete] = useState(null);

//   const [newStudent, setNewStudent] = useState({
//     student_first_name: "",
//     student_last_name: "",
//     dob: "",
//     admission_date: "",
//     section: "",
//     aadhaar_card: "",
//     parent_name: "",
//     parent_email: "",
//     parent_mobile: "",
//     send_sms: false,
//     send_email: false,
//     set_temp_password: false,
//     l12: "",
//   });

//   const [users, setUsers] = useState([]);
//   const [uploadedImage, setUploadedImage] = useState(null);

//   // -------- Handlers --------
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewStudent({ ...newStudent, [name]: value });
//   };

//   const handleSelectChange = (name, value) => {
//     setNewStudent({ ...newStudent, [name]: value });
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setUploadedImage(file);
//       handleSelectChange("student_image", file);
//     }
//   };

//   const resetFilters = () => {
//     setSearchTerm("");
//     setSelectedGrade("");
//     setSelectedSection("");
//     setSelectedStatus("");
//     setCurrentPage(1);
//   };

//   // -------- Filtered & Paginated Students --------
//   const filteredStudents = students.filter((s) => {
//     const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchGrade = selectedGrade ? s.grade === selectedGrade : true;
//     const matchSection = selectedSection ? s.section === selectedSection : true;
//     const matchStatus = selectedStatus ? s.status === selectedStatus : true;
//     return matchSearch && matchGrade && matchSection && matchStatus;
//   });

//   const totalFilteredPages = Math.ceil(filteredStudents.length / itemsPerPage);
//   const paginatedStudents = filteredStudents.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // -------- Delete Handler Placeholder --------
//   const handleDeleteStudent = () => {
//     // Implement API delete logic
//     setIsDeleteDialogOpen(false);
//     toast({ title: "Student deleted successfully." });
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Students</h2>
//           <p className="text-muted-foreground">Manage student records and information</p>
//         </div>

//         {/* Add Student & Export Buttons */}
//         <div className="flex items-center gap-2">
//           <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
//             <DialogTrigger asChild>
//               <Button>
//                 <Plus className="mr-2 h-4 w-4" /> Add Student
//               </Button>
//             </DialogTrigger>

//             <DialogContent className="sm:max-w-[1000px]">
//               <DialogHeader>
//                 <DialogTitle>Add New Student</DialogTitle>
//               </DialogHeader>

//               <div className="flex flex-col lg:flex-row gap-6">
//                 {/* Left Cards */}
//                 <div className="grid grid-cols-1 gap-4 lg:w-1/3">
//                   {/* Upload Image */}
//                   <div
//                     className="p-4 rounded-lg border-2 border-dashed border-gray-400 flex flex-col items-center justify-center gap-2 h-40 w-full cursor-pointer relative"
//                     onClick={() => document.getElementById("student-image-input").click()}
//                   >
//                     <input
//                       type="file"
//                       id="student-image-input"
//                       accept="image/*"
//                       onChange={handleImageUpload}
//                       className="hidden"
//                     />
//                     {!uploadedImage ? (
//                       <p className="text-gray-600 text-sm">Click to upload image</p>
//                     ) : (
//                       <img
//                         src={URL.createObjectURL(uploadedImage)}
//                         alt="Preview"
//                         className="w-32 h-32 object-cover rounded-md border"
//                       />
//                     )}
//                   </div>

//                   {/* Parent / Guardian */}
//                   <div className="p-4 rounded-lg border shadow-sm space-y-2">
//                     <h3 className="text-sm font-semibold">Parent / Guardian</h3>
//                     <Input
//                       name="parent_name"
//                       placeholder="Name"
//                       value={newStudent.parent_name}
//                       onChange={handleInputChange}
//                     />
//                     <Input
//                       name="parent_email"
//                       placeholder="Email"
//                       value={newStudent.parent_email}
//                       onChange={handleInputChange}
//                     />
//                     <Input
//                       name="parent_mobile"
//                       placeholder="Mobile"
//                       value={newStudent.parent_mobile}
//                       onChange={handleInputChange}
//                     />
//                   </div>

//                   {/* Actions */}
//                   <div className="p-4 rounded-lg border shadow-sm space-y-2">
//                     <h3 className="text-sm font-semibold">Actions</h3>
//                     <div className="flex flex-col gap-2">
//                       {["send_sms", "send_email", "set_temp_password"].map((field) => (
//                         <label key={field} className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             checked={newStudent[field] || false}
//                             onChange={(e) => handleSelectChange(field, e.target.checked)}
//                           />
//                           {field === "send_sms" ? "Send SMS OTP" : field === "send_email" ? "Send Email Link" : "Set Temporary Password"}
//                         </label>
//                       ))}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Right Form */}
//                 <div className="lg:w-2/3 mt-4 lg:mt-0">
//                   <div className="grid gap-4 py-4">
//                     {/* First & Last Name */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>First Name</Label>
//                         <Input
//                           name="student_first_name"
//                           value={newStudent.student_first_name}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Last Name</Label>
//                         <Input
//                           name="student_last_name"
//                           value={newStudent.student_last_name}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                     </div>

//                     {/* DOB & Admission Date */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>DOB</Label>
//                         <Input
//                           name="dob"
//                           type="date"
//                           value={newStudent.dob}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Admission Date</Label>
//                         <Input
//                           name="admission_date"
//                           type="date"
//                           value={newStudent.admission_date}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                     </div>

//                     {/* Section & Roll Number */}
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label>Section</Label>
//                         <Select
//                           value={newStudent.section}
//                           onValueChange={(value) => handleSelectChange("section", value)}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select section" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {["A", "B", "C"].map((section) => (
//                               <SelectItem key={section} value={section}>
//                                 Section {section}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div className="space-y-2">
//                         <Label>Roll Number</Label>
//                         <Input
//                           name="aadhaar_card"
//                           value={newStudent.aadhaar_card}
//                           onChange={handleInputChange}
//                         />
//                       </div>
//                     </div>

//                     {/* Medical Notes */}
//                     <div className="space-y-2">
//                       <Label>Medical Notes</Label>
//                       <textarea
//                         id="l12"
//                         placeholder="Enter details..."
//                         value={newStudent.l12 || ""}
//                         onChange={(e) => handleSelectChange("l12", e.target.value)}
//                         className="w-full rounded-md border border-gray-200 p-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
//                   Cancel
//                 </Button>
//                 <Button onClick={() => console.log("Add student logic")}>Add Student</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           <Button variant="outline">
//             <Download className="mr-2 h-4 w-4" /> Export
//           </Button>
//         </div>
//       </div>

//       {/* Search & Filters */}
//       <div className="flex flex-col gap-4 md:flex-row">
//         <div className="flex-1 relative">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search students..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <div className="flex gap-2">
//           <Select value={selectedGrade} onValueChange={setSelectedGrade}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Grade" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Grades</SelectItem>
//               {["9", "10", "11", "12"].map((grade) => (
//                 <SelectItem key={grade} value={grade}>
//                   Grade {grade}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={selectedSection} onValueChange={setSelectedSection}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Section" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Sections</SelectItem>
//               {["A", "B", "C"].map((section) => (
//                 <SelectItem key={section} value={section}>
//                   Section {section}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//             <SelectTrigger className="w-[120px]">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="">All Status</SelectItem>
//               <SelectItem value="Active">Active</SelectItem>
//               <SelectItem value="Inactive">Inactive</SelectItem>
//             </SelectContent>
//           </Select>

//           <Button variant="ghost" size="icon" onClick={resetFilters}>
//             <X className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Student Cards & Pagination can be added below */}
//     </div>
//   );
// };

// export default Students;
