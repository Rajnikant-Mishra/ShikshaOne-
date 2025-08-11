
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Download, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Eye,
  Mail,
  Phone,
  BookOpen,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

// Mock data for teachers
const initialTeachers = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Science',
    subjects: ['Physics', 'Chemistry'],
    qualification: 'Ph.D. in Physics',
    joinDate: '2018-08-15',
    status: 'Active',
    avatar: '',
  },
  {
    id: '2',
    name: 'Prof. Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Mathematics',
    subjects: ['Algebra', 'Calculus'],
    qualification: 'M.Sc. in Mathematics',
    joinDate: '2019-07-10',
    status: 'Active',
    avatar: '',
  },
  {
    id: '3',
    name: 'Ms. Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 345-6789',
    department: 'English',
    subjects: ['Literature', 'Grammar'],
    qualification: 'M.A. in English Literature',
    joinDate: '2020-01-05',
    status: 'Active',
    avatar: '',
  },
  {
    id: '4',
    name: 'Mr. Robert Wilson',
    email: 'robert.wilson@example.com',
    phone: '+1 (555) 456-7890',
    department: 'History',
    subjects: ['World History', 'Geography'],
    qualification: 'M.A. in History',
    joinDate: '2017-09-20',
    status: 'On Leave',
    avatar: '',
  },
  {
    id: '5',
    name: 'Dr. Jennifer Lee',
    email: 'jennifer.lee@example.com',
    phone: '+1 (555) 567-8901',
    department: 'Computer Science',
    subjects: ['Programming', 'Data Structures'],
    qualification: 'Ph.D. in Computer Science',
    joinDate: '2021-02-15',
    status: 'Active',
    avatar: '',
  },
  {
    id: '6',
    name: 'Prof. David Martinez',
    email: 'david.martinez@example.com',
    phone: '+1 (555) 678-9012',
    department: 'Physical Education',
    subjects: ['Sports', 'Health Education'],
    qualification: 'B.Ed. in Physical Education',
    joinDate: '2019-11-10',
    status: 'Active',
    avatar: '',
  },
];

const Teachers = () => {
  const [teachers, setTeachers] = useState(initialTeachers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    subjects: '',
    qualification: '',
    joinDate: '',
    status: 'Active',
  });
  
  const { toast } = useToast();

  // Filter teachers based on search and filters
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment ? teacher.department === selectedDepartment : true;
    const matchesStatus = selectedStatus ? teacher.status === selectedStatus : true;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddTeacher = () => {
    if (!newTeacher.name || !newTeacher.email || !newTeacher.department || !newTeacher.qualification) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    const id = (teachers.length + 1).toString();
    const subjectsArray = newTeacher.subjects.split(',').map(subject => subject.trim());
    const teacherWithId = { 
      ...newTeacher, 
      id, 
      subjects: subjectsArray,
      avatar: '' 
    };
    
    setTeachers([...teachers, teacherWithId]);
    setNewTeacher({
      name: '',
      email: '',
      phone: '',
      department: '',
      subjects: '',
      qualification: '',
      joinDate: '',
      status: 'Active',
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: 'Teacher added',
      description: `${newTeacher.name} has been added successfully.`,
    });
  };

  const handleDeleteTeacher = () => {
    if (!teacherToDelete) return;
    
    setTeachers(teachers.filter(teacher => teacher.id !== teacherToDelete.id));
    setIsDeleteDialogOpen(false);
    setTeacherToDelete(null);
    
    toast({
      title: 'Teacher removed',
      description: 'The teacher has been removed successfully.',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setNewTeacher({ ...newTeacher, [name]: value });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('');
    setSelectedStatus('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers</h2>
          <p className="text-muted-foreground">
            Manage teacher profiles and assignments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>
                  Enter the details of the new teacher below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newTeacher.name}
                      onChange={handleInputChange}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={newTeacher.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={newTeacher.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={newTeacher.department}
                      onValueChange={(value) => handleSelectChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Science">Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="History">History</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Physical Education">Physical Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subjects">Subjects (comma separated)</Label>
                  <Input
                    id="subjects"
                    name="subjects"
                    value={newTeacher.subjects}
                    onChange={handleInputChange}
                    placeholder="Physics, Chemistry"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      name="qualification"
                      value={newTeacher.qualification}
                      onChange={handleInputChange}
                      placeholder="Ph.D. in Physics"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      type="date"
                      value={newTeacher.joinDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTeacher.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTeacher}>Add Teacher</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search teachers..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              <SelectItem value="Science">Science</SelectItem>
              <SelectItem value="Mathematics">Mathematics</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="History">History</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Physical Education">Physical Education</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="On Leave">On Leave</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={resetFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {filteredTeachers.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-primary/10 p-3">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No teachers found</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              No teachers match your search criteria. Try adjusting your filters or add a new teacher.
            </p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Teacher
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
          {filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={
                        teacher.status === 'Active' 
                          ? 'default' 
                          : teacher.status === 'On Leave' 
                            ? 'secondary' 
                            : 'outline'
                      }
                    >
                      {teacher.status}
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
                          Edit Teacher
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setTeacherToDelete(teacher);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete Teacher
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={teacher.avatar} />
                      <AvatarFallback className="text-lg">{teacher.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{teacher.name}</h3>
                      <p className="text-sm text-muted-foreground">{teacher.department}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span>{teacher.subjects.join(', ')}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Qualification</p>
                    <p className="text-sm font-medium">{teacher.qualification}</p>
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
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this teacher? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {teacherToDelete && (
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{teacherToDelete.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{teacherToDelete.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {teacherToDelete.department}
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teachers;
