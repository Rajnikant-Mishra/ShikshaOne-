
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye,
  Users,
  Clock,
  Calendar,
  GraduationCap,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for classes
const initialClasses = [
  {
    id: '1',
    name: 'Physics 101',
    grade: '11',
    section: 'A',
    teacher: 'Dr. Sarah Johnson',
    schedule: 'Mon, Wed, Fri 9:00 AM - 10:30 AM',
    room: 'Science Lab 1',
    students: 32,
    status: 'Active',
  },
  {
    id: '2',
    name: 'Advanced Mathematics',
    grade: '12',
    section: 'B',
    teacher: 'Prof. Michael Brown',
    schedule: 'Tue, Thu 11:00 AM - 1:00 PM',
    room: 'Room 203',
    students: 28,
    status: 'Active',
  },
  {
    id: '3',
    name: 'English Literature',
    grade: '10',
    section: 'A',
    teacher: 'Ms. Emily Davis',
    schedule: 'Mon, Wed 2:00 PM - 3:30 PM',
    room: 'Room 105',
    students: 35,
    status: 'Active',
  },
  {
    id: '4',
    name: 'World History',
    grade: '9',
    section: 'B',
    teacher: 'Mr. Robert Wilson',
    schedule: 'Tue, Thu 9:00 AM - 10:30 AM',
    room: 'Room 302',
    students: 30,
    status: 'Active',
  },
  {
    id: '5',
    name: 'Computer Programming',
    grade: '11',
    section: 'A',
    teacher: 'Dr. Jennifer Lee',
    schedule: 'Mon, Wed, Fri 1:00 PM - 2:30 PM',
    room: 'Computer Lab',
    students: 25,
    status: 'Active',
  },
  {
    id: '6',
    name: 'Physical Education',
    grade: '10',
    section: 'B',
    teacher: 'Prof. David Martinez',
    schedule: 'Tue, Thu 2:00 PM - 3:30 PM',
    room: 'Gymnasium',
    students: 40,
    status: 'Inactive',
  },
];

const Classes = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [newClass, setNewClass] = useState({
    name: '',
    grade: '',
    section: '',
    teacher: '',
    schedule: '',
    room: '',
    students: 0,
    status: 'Active',
  });
  
  const { toast } = useToast();

  // Filter classes based on search and filters
  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         cls.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade ? cls.grade === selectedGrade : true;
    const matchesStatus = selectedStatus ? cls.status === selectedStatus : true;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const handleAddClass = () => {
    if (!newClass.name || !newClass.grade || !newClass.section || !newClass.teacher) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const id = (classes.length + 1).toString();
    const classWithId = { 
      ...newClass, 
      id,
      students: parseInt(newClass.students) || 0
    };
    
    setClasses([...classes, classWithId]);
    setNewClass({
      name: '',
      grade: '',
      section: '',
      teacher: '',
      schedule: '',
      room: '',
      students: 0,
      status: 'Active',
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Class added',
      description: `${newClass.name} has been added successfully.`,
    });
  };

  const handleDeleteClass = () => {
    if (!classToDelete) return;
    
    setClasses(classes.filter(cls => cls.id !== classToDelete.id));
    setIsDeleteDialogOpen(false);
    setClassToDelete(null);
    
    toast({
      title: 'Class removed',
      description: 'The class has been removed successfully.',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewClass({ ...newClass, [name]: value });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGrade('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
          <p className="text-muted-foreground">
            Manage classes, schedules, and assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
                <DialogDescription>
                  Enter the details of the new class below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Class Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newClass.name}
                    onChange={handleInputChange}
                    placeholder="Physics 101"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Select
                      value={newClass.grade}
                      onValueChange={(value) => handleSelectChange('grade', value)}
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
                      value={newClass.section}
                      onValueChange={(value) => handleSelectChange('section', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {['A', 'B', 'C'].map((section) => (
                          <SelectItem key={section} value={section}>
                            Section {section}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacher">Teacher</Label>
                  <Input
                    id="teacher"
                    name="teacher"
                    value={newClass.teacher}
                    onChange={handleInputChange}
                    placeholder="Dr. Sarah Johnson"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    name="schedule"
                    value={newClass.schedule}
                    onChange={handleInputChange}
                    placeholder="Mon, Wed, Fri 9:00 AM - 10:30 AM"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      name="room"
                      value={newClass.room}
                      onChange={handleInputChange}
                      placeholder="Science Lab 1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="students">Number of Students</Label>
                    <Input
                      id="students"
                      name="students"
                      type="number"
                      value={newClass.students}
                      onChange={handleInputChange}
                      placeholder="30"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newClass.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddClass}>Add Class</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search classes..."
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
            <TabsList className="ml-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="grid" className="mt-6">
          {filteredClasses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No classes found</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  No classes match your search criteria. Try adjusting your filters or add a new class.
                </p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Class
                </Button>
              </CardContent>
            </Card>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredClasses.map((cls) => (
                <motion.div
                  key={cls.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={cls.status === 'Active' ? 'default' : 'outline'}>
                          {cls.status}
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
                              Edit Class
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setClassToDelete(cls);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Class
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <h3 className="text-lg font-semibold">{cls.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Grade {cls.grade}, Section {cls.section}
                      </p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.teacher}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.room}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{cls.students} Students</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t px-6 py-3">
                      <Button variant="ghost" className="w-full">
                        View Class Details
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          {filteredClasses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="rounded-full bg-primary/10 p-3">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No classes found</h3>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  No classes match your search criteria. Try adjusting your filters or add a new class.
                </p>
                <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Class
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-6 gap-4 border-b bg-muted/50 p-4 font-medium">
                <div className="col-span-2">Class</div>
                <div className="hidden md:block">Teacher</div>
                <div className="hidden md:block">Schedule</div>
                <div className="hidden md:block">Students</div>
                <div className="text-right">Actions</div>
              </div>
              {filteredClasses.map((cls) => (
                <div key={cls.id} className="grid grid-cols-6 gap-4 border-b p-4">
                  <div className="col-span-2">
                    <div className="font-medium">{cls.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Grade {cls.grade}, Section {cls.section}
                    </div>
                  </div>
                  <div className="hidden md:block">{cls.teacher}</div>
                  <div className="hidden md:block text-sm">{cls.schedule}</div>
                  <div className="hidden md:block">{cls.students}</div>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Class
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setClassToDelete(cls);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Class
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {classToDelete && (
              <div>
                <p className="font-medium">{classToDelete.name}</p>
                <p className="text-sm text-muted-foreground">
                  Grade {classToDelete.grade}, Section {classToDelete.section}
                </p>
                <p className="text-sm text-muted-foreground">
                  Teacher: {classToDelete.teacher}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClass}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
