import React, { useEffect } from "react";
import { Home, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useToast } from "../../components/ui/use-toast";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation Schema (same as add form)
const schema = yup.object({
  name: yup.string().required("Teacher name is required"),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
    .required("Phone is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  joining_date: yup
    .string()
    .required("Joining date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  subjects: yup
    .array()
    .of(yup.number())
    .min(1, "Select at least one subject")
    .required("Subjects are required"),
  classes: yup
    .array()
    .of(yup.number())
    .min(1, "Select at least one class")
    .required("Classes are required"),
});

const fetchClasses = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/student-class/`);
  return Array.isArray(data) ? data : data?.data || data?.results || [];
};

const fetchSubjects = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/api/subjects/`);
  return Array.isArray(data) ? data : data?.data || data?.results || [];
};

const fetchTeacher = async (id) => {
  const { data } = await axios.get(`${API_BASE_URL}/api/teacher/${id}/`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return data;
};

const EditTeacherForm = () => {
  const { id } = useParams(); // Get teacher ID from URL
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: classes = [],
    isLoading: classesLoading,
    error: classesError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
  });

  const {
    data: subjects = [],
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: fetchSubjects,
  });

  const {
    data: teacher,
    isLoading: teacherLoading,
    error: teacherError,
  } = useQuery({
    queryKey: ["teacher", id],
    queryFn: () => fetchTeacher(id),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Populate form when teacher data is loaded
  useEffect(() => {
    if (teacher) {
      reset({
        name: teacher.name || "",
        phone: teacher.phone || "",
        email: teacher.email || "",
        joining_date: teacher.joining_date || "",
        subjects: teacher.subjects?.map((s) => s.id) || [],
        classes: teacher.classes?.map((c) => c.id) || [],
      });
    }
  }, [teacher, reset]);

  const selectedSubjects = watch("subjects") || [];
  const selectedClasses = watch("classes") || [];

  const handleCheckboxChange = (field, id, checked) => {
    const current = watch(field) || [];
    if (checked) {
      setValue(field, [...current, id], { shouldValidate: true });
    } else {
      setValue(
        field,
        current.filter((item) => item !== id),
        { shouldValidate: true }
      );
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      await axios.put(
        `${API_BASE_URL}/api/teacher/${id}/`,
        {
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone,
          joining_date: data.joining_date,
          classes: data.classes,
          subjects: data.subjects,
          status: teacher.status || "Active", // preserve existing status
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });
      toast({
        title: "Success!",
        description: `Teacher ${
          teacher?.name || "updated"
        } has been updated successfully.`,
      });
      navigate("/teacher"); // redirect to teachers list after success
    },
    onError: (error) => {
      let message = "Failed to update teacher.";
      if (error.response?.data) {
        if (typeof error.response.data === "string")
          message = error.response.data;
        else if (error.response.data.error) message = error.response.data.error;
        else if (error.response.data.detail)
          message = error.response.data.detail;
        else if (Object.values(error.response.data).flat().length > 0) {
          message = Object.values(error.response.data).flat().join(" ");
        }
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  const isLoading = classesLoading || subjectsLoading || teacherLoading;
  const hasError = classesError || subjectsError || teacherError;

  if (hasError) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load data. Please try again later.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-600">
        Loading teacher details...
      </div>
    );
  }

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8">
        <Link
          to="/"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <Link to="/teacher" className="text-blue-600 hover:text-blue-800">
          Teachers
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <span className="text-gray-700 font-medium">Edit Teacher</span>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Edit Teacher</CardTitle>
          <p className="text-muted-foreground mt-1">
            Update teacher information and assignments.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Teacher Name *</Label>
                <Input
                  {...register("name")}
                  placeholder="e.g. John Smith"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joining_date">Joining Date *</Label>
                <Input
                  type="date"
                  {...register("joining_date")}
                  className={errors.joining_date ? "border-red-500" : ""}
                />
                {errors.joining_date && (
                  <p className="text-sm text-red-600">
                    {errors.joining_date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  type="tel"
                  {...register("phone")}
                  placeholder="9876543210"
                  maxLength={10}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="john@school.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Subjects Selection */}
            <div className="space-y-3">
              <Label>Assign Subjects *</Label>
              {subjects.length === 0 ? (
                <p className="text-sm text-gray-500">No subjects available.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                  {subjects.map((subject) => (
                    <div
                      key={subject.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={`subject-${subject.id}`}
                        checked={selectedSubjects.includes(subject.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("subjects", subject.id, checked)
                        }
                      />
                      <label
                        htmlFor={`subject-${subject.id}`}
                        className="text-sm font-medium cursor-pointer select-none"
                      >
                        {subject.subject_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {errors.subjects && (
                <p className="text-sm text-red-600 -mt-2">
                  {errors.subjects.message}
                </p>
              )}
            </div>

            {/* Classes Selection */}
            <div className="space-y-3">
              <Label>Assign Classes *</Label>
              {classes.length === 0 ? (
                <p className="text-sm text-gray-500">No classes available.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg">
                  {classes.map((cls) => (
                    <div key={cls.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`class-${cls.id}`}
                        checked={selectedClasses.includes(cls.id)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange("classes", cls.id, checked)
                        }
                      />
                      <label
                        htmlFor={`class-${cls.id}`}
                        className="text-sm font-medium cursor-pointer select-none"
                      >
                        {cls.class_name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {errors.classes && (
                <p className="text-sm text-red-600 -mt-2">
                  {errors.classes.message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/teacher")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Update Teacher"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTeacherForm;
