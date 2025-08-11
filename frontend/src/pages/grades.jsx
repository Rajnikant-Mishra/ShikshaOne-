
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Download, 
  BarChart3, 
  ChevronDown, 
  ChevronUp,
  X,
  Edit,
  Save,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Mock data for grades
const initialGrades = [
  {
    id: '1',
    name: 'Emma Wilson',
    grade: '10',
    section: 'A',
    rollNumber: '1001',
    subjects: {
      'Mathematics': { midterm: 85, final: 88, assignment: 90, total: 87.5, grade: 'A' },
      'Science': { midterm: 78, final: 82, assignment: 85, total: 81.5, grade: 'B' },
      'English': { midterm: 92, final: 95, assignment: 88, total: 92.0, grade: 'A' },
      'History': { midterm: 76, final: 80, assignment: 82, total: 79.5, grade: 'B' },
    },
  },
  {
    id: '2',
    name: 'James Rodriguez',
    grade: '10',
    section: 'B',
    rollNumber: '1002',
    subjects: {
      'Mathematics': { midterm: 92, final: 95, assignment: 90, total: 92.5, grade: 'A' },
      'Science': { midterm: 88, final: 85, assignment: 92, total: 88.0, grade: 'A' },
      'English': { midterm: 75, final: 78, assignment: 80, total: 77.5, grade: 'B' },
      'History': { midterm: 82, final: 85, assignment: 80, total: 82.5, grade: 'B' },
    },
  },
  {
    id: '3',
    name: 'Sophia Chen',
    grade: '9',
    section: 'A',
    rollNumber: '901',
    subjects: {
      'Mathematics': { midterm: 95, final: 98, assignment: 96, total: 96.5, grade: 'A+' },
      'Science': { midterm: 90, final: 92, assignment: 94, total: 92.0, grade: 'A' },
      'English': { midterm: 88, final: 85, assignment: 90, total: 87.5, grade: 'A' },
      'History': { midterm: 85, final: 88, assignment: 82, total: 85.5, grade: 'A' },
    },
  },
  {
    id: '4',
    name: 'Ethan Brown',
    grade: '9',
    section: 'B',
    rollNumber: '902',
    subjects: {
      'Mathematics': { midterm: 72, final: 68, assignment: 75, total: 71.5, grade: 'C' },
      'Science': { midterm: 65, final: 70, assignment: 68, total: 67.5, grade: 'C' },
      'English': { midterm: 78, final: 75, assignment: 80, total: 77.5, grade: 'B' },
      'History': { midterm: 70, final: 72, assignment: 75, total: 72.5, grade: 'C' },
    },
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    grade: '11',
    section: 'A',
    rollNumber: '1101',
    subjects: {
      'Mathematics': { midterm: 88, final: 92, assignment: 90, total: 90.0, grade: 'A' },
      'Science': { midterm: 85, final: 88, assignment: 90, total: 87.5, grade: 'A' },
      'English': { midterm: 95, final: 98, assignment: 96, total: 96.5, grade: 'A+' },
      'History': { midterm: 90, final: 92, assignment: 88, total: 90.0, grade: 'A' },
    },
  },
  {
    id: '6',
    name: 'Noah Johnson',
    grade: '11',
    section: 'B',
    rollNumber: '1102',
    subjects: {
      'Mathematics': { midterm: 78, final: 82, assignment: 80, total: 80.0, grade: 'B' },
      'Science': { midterm: 82, final: 85, assignment: 80, total: 82.5, grade: 'B' },
      'English': { midterm: 75, final: 78, assignment: 80, total: 77.5, grade: 'B' },
      'History': { midterm: 80, final: 82, assignment: 85, total: 82.5, grade: 'B' },
    },
  },
];

const subjects = ['Mathematics', 'Science', 'English', 'History'];

const Grades = () => {
  const [grades, setGrades] = useState(initialGrades);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [editMode, setEditMode] = useState(false);
  const [editedGrades, setEditedGrades] = useState({});
  const { toast } = useToast();

  // Filter students based on search and filters
  const filteredStudents = grades.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade ? student.grade === selectedGrade : true;
    const matchesSection = selectedSection ? student.section === selectedSection : true;
    
    return matchesSearch && matchesGrade && matchesSection;
  });

  const handleEditStart = () => {
    // Initialize edited grades with current values
    const initialEdits = {};
    filteredStudents.forEach(student => {
      initialEdits[student.id] = {
        midterm: student.subjects[selectedSubject].midterm,
        final: student.subjects[selectedSubject].final,
        assignment: student.subjects[selectedSubject].assignment,
      };
    });
    setEditedGrades(initialEdits);
    setEditMode(true);
  };

  const handleEditCancel = () => {
    setEditMode(false);
    setEditedGrades({});
  };

  const handleEditSave = () => {
    // Calculate new totals and grades
    const updatedGrades = grades.map(student => {
      if (editedGrades[student.id]) {
        const midterm = editedGrades[student.id].midterm;
        const final = editedGrades[student.id].final;
        const assignment = editedGrades[student.id].assignment;
        
        // Calculate total (weighted average)
        const total = (midterm * 0.3) + (final * 0.5) + (assignment * 0.2);
        
        // Determine letter grade
        let letterGrade;
        if (total >= 95) letterGrade = 'A+';
        else if (total >= 85) letterGrade = 'A';
        else if (total >= 80) letterGrade = 'B+';
        else if (total >= 75) letterGrade = 'B';
        else if (total >= 70) letterGrade = 'C+';
        else if (total >= 65) letterGrade = 'C';
        else if (total >= 60) letterGrade = 'D';
        else letterGrade = 'F';
        
        return {
          ...student,
          subjects: {
            ...student.subjects,
            [selectedSubject]: {
              midterm,
              final,
              assignment,
              total: parseFloat(total.toFixed(1)),
              grade: letterGrade,
            },
          },
        };
      }
      return student;
    });
    
    setGrades(updatedGrades);
    setEditMode(false);
    setEditedGrades({});
    
    toast({
      title: "Grades updated",
      description: `Grades for ${selectedSubject} have been updated successfully.`,
    });
  };

  const handleGradeChange = (studentId, type, value) => {
    // Ensure value is between 0 and 100
    const numValue = Math.min(Math.max(parseInt(value) || 0, 0), 100);
    
    setEditedGrades(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: numValue,
      },
    }));
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'text-green-500';
    if (grade === 'B+' || grade === 'B') return 'text-blue-500';
    if (grade === 'C+' || grade === 'C') return 'text-amber-500';
    if (grade === 'D') return 'text-orange-500';
    return 'text-red-500';
  };

  const getClassAverage = (subject) => {
    if (filteredStudents.length === 0) return 0;
    
    const sum = filteredStudents.reduce((acc, student) => {
      return acc + student.subjects[subject].total;
    }, 0);
    
    return (sum / filteredStudents.length).toFixed(1);
  };

  const getHighestScore = (subject) => {
    if (filteredStudents.length === 0) return 0;
    
    return Math.max(...filteredStudents.map(student => student.subjects[subject].total));
  };

  const getLowestScore = (subject) => {
    if (filteredStudents.length === 0) return 0;
    
    return Math.min(...filteredStudents.map(student => student.subjects[subject].total));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedSection('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Grades</h2>
          <p className="text-muted-foreground">
            Manage and view student grades
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
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
              <SelectItem value="">All Grades</SelectItem>
              {['9', '10', '11', '12'].map((grade) => (
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
              {['A', 'B'].map((section) => (
                <SelectItem key={section} value={section}>
                  Section {section}
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Grade Report</CardTitle>
              <CardDescription>
                View and manage student grades by subject
              </CardDescription>
            </div>
            <Tabs 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
              className="w-full md:w-auto"
            >
              <TabsList className="w-full md:w-auto">
                {subjects.map(subject => (
                  <TabsTrigger key={subject} value={subject}>
                    {subject}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Class Average</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getClassAverage(selectedSubject)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{getHighestScore(selectedSubject)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Lowest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{getLowestScore(selectedSubject)}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{filteredStudents.length}</div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mb-4">
            {editMode ? (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEditCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleEditSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            ) : (
              <Button onClick={handleEditStart}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Grades
              </Button>
            )}
          </div>

          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="rounded-full bg-primary/10 p-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No students found</h3>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                No students match your search criteria. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Student</div>
                <div className="col-span-2">Grade/Section</div>
                <div className="col-span-1">Midterm</div>
                <div className="col-span-1">Final</div>
                <div className="col-span-1">Assignment</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-2">Grade</div>
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
                    <div className="col-span-3 font-medium">{student.name}</div>
                    <div className="col-span-2">
                      Grade {student.grade}, Section {student.section}
                    </div>
                    <div className="col-span-1">
                      {editMode ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editedGrades[student.id]?.midterm || ''}
                          onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                          className="w-16"
                        />
                      ) : (
                        student.subjects[selectedSubject].midterm
                      )}
                    </div>
                    <div className="col-span-1">
                      {editMode ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editedGrades[student.id]?.final || ''}
                          onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                          className="w-16"
                        />
                      ) : (
                        student.subjects[selectedSubject].final
                      )}
                    </div>
                    <div className="col-span-1">
                      {editMode ? (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={editedGrades[student.id]?.assignment || ''}
                          onChange={(e) => handleGradeChange(student.id, 'assignment', e.target.value)}
                          className="w-16"
                        />
                      ) : (
                        student.subjects[selectedSubject].assignment
                      )}
                    </div>
                    <div className="col-span-1 font-medium">
                      {student.subjects[selectedSubject].total}%
                    </div>
                    <div className="col-span-2">
                      <Badge 
                        variant="outline" 
                        className={`font-bold ${getGradeColor(student.subjects[selectedSubject].grade)}`}
                      >
                        {student.subjects[selectedSubject].grade}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {filteredStudents.length > 0 && (
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <AlertCircle className="mr-2 h-4 w-4" />
              <span>
                Grading Scale: A+ (95-100), A (85-94), B+ (80-84), B (75-79), C+ (70-74), C (65-69), D (60-64), F (0-59)
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Grades;
