import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, X, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToast } from "../../components/ui/use-toast";
import axios from "axios";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import { Link } from "react-router-dom"; // Assuming you're using React Router

// Validation Schemas
const personalInfoSchema = yup.object({
  firstName: yup.string().required("First name is required").min(2),
  middleName: yup.string(),
  lastName: yup.string().required("Last name is required").min(2),
  dob: yup.string().required("Date of birth is required"),
  gender: yup
    .string()
    .oneOf(["Male", "Female", "Other"])
    .required("Gender is required"),
  bloodGroup: yup.string(),
  // admissionNumber: yup.string().required("Admission number is required"),
  admissionDate: yup.string().required("Admission date is required"),
  class_id: yup.string().required("Class is required"),
  section: yup.string().required("Section is required"),
  // rollNumber: yup.string().required("Roll number is required"),
});

const contactSchema = yup.object({
  phone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  altPhone: yup
    .string()
    .matches(/^\d{10}$|^$/, "Alternate phone must be 10 digits or empty"),
  email: yup.string().email("Invalid email").required("Email is required"),
  tags: yup.array().of(yup.string()),
});

const guardianAddressSchema = yup.object({
  fatherName: yup.string().required("Father's name is required"),
  motherName: yup.string().required("Mother's name is required"),
  guardianType: yup.string().oneOf(["Father", "Mother", "Other"]).required(),
  guardianPhone: yup
    .string()
    .matches(/^\d{10}$/, "Phone must be 10 digits")
    .required(),
  guardianEmail: yup.string().email("Invalid email"),
  addressLine1: yup.string().required("Address line 1 is required"),
  addressLine2: yup.string(),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  postalCode: yup
    .string()
    .matches(/^\d{6}$/, "Postal code must be 6 digits")
    .required(),
  country: yup.string().required(),
});

const documentsSchema = yup.object({
  photo: yup.mixed().required("Student photo is required"),
  photoNote: yup.string(),
  birthCertificate: yup.mixed().nullable(),
  birthCertNote: yup.string(),
  idProof: yup.mixed().nullable(),
  idProofNote: yup.string(),
});

const StudentAdmissionForm = () => {
  const [step, setStep] = useState(1);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { toast } = useToast();

  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      step === 1
        ? personalInfoSchema
        : step === 2
        ? contactSchema
        : step === 3
        ? guardianAddressSchema
        : documentsSchema
    ),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dob: "",
      gender: "",
      bloodGroup: "",
      admissionNumber: "",
      admissionDate: "",
      class_id: "",
      section: "",
      rollNumber: "",
      phone: "",
      altPhone: "",
      email: "",
      tags: [],
      fatherName: "",
      motherName: "",
      guardianType: "Father",
      guardianPhone: "",
      guardianEmail: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      photo: null,
      photoNote: "",
      birthCertificate: null,
      birthCertNote: "",
      idProof: null,
      idProofNote: "",
    },
  });

  const watchedTags = watch("tags") || [];

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleFileChange =
    (fieldName, previewSetter = null) =>
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setValue(fieldName, file);
        if (previewSetter && fieldName === "photo") {
          const reader = new FileReader();
          reader.onloadend = () => previewSetter(reader.result);
          reader.readAsDataURL(file);
        }
      }
    };

  const handleDrop =
    (fieldName, previewSetter = null) =>
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (file) {
        setValue(fieldName, file);
        if (previewSetter && fieldName === "photo") {
          const reader = new FileReader();
          reader.onloadend = () => previewSetter(reader.result);
          reader.readAsDataURL(file);
        }
      }
    };

  const removeFile = (fieldName, previewSetter = null) => {
    setValue(fieldName, null);
    if (previewSetter) previewSetter(null);
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
          if (Array.isArray(data[key])) {
            data[key].forEach((item) => formData.append(key, item));
          } else {
            formData.append(key, data[key]);
          }
        }
      });

      await axios.post(`${API_BASE_URL}/api/students/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: "Success",
        description: "Student admitted successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.error || "Failed to submit form",
      });
    }
  };

  const stepTitles = [
    "Personal Information",
    "Contact Information",
    "Guardian & Address",
    "Upload Documents",
  ];

  const documents = [
    {
      field: "photo",
      label: "Student Photo *",
      noteField: "photoNote",
      preview: photoPreview,
      setPreview: setPhotoPreview,
    },
    {
      field: "birthCertificate",
      label: "Birth Certificate",
      noteField: "birthCertNote",
    },
    {
      field: "idProof",
      label: "ID Proof (Aadhaar/Passport)",
      noteField: "idProofNote",
    },
  ];

  return (
    <div className="w-full min-h-screen  px-4 ">
      {/* Breadcrumbs - ShadCN Style */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link
          to="/"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
        >
          <Home className="h-4 w-4 text-blue-600" />
          Dashboard
        </Link>

        <ChevronRight className="h-4 w-4 text-blue-600" />

        <Link to="/students" className="text-blue-600 hover:text-blue-700">
          Students
        </Link>

        <ChevronRight className="h-4 w-4 text-blue-600" />

        <span className="text-600 font-medium">Add New Student</span>
      </div>

      <div className="w-full mx-auto">
        <Card className="w-full shadow-xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl font-bold text-center">
              Student Admission Form
            </CardTitle>

            {/* Progress Bar */}

            <div className="w-full  mt-9">
              <div className="flex  gap-6 w-full">
                {[...Array(totalSteps)].map((_, i) => (
                  <div key={i} className="flex items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                        step >= i + 1 ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      {step > i + 1 ? "✓" : i + 1}
                    </div>

                    {i < totalSteps - 1 && (
                      <div
                        className={`h-1 flex-1 rounded-full transition-all mx-4 ${
                          step > i + 1 ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center mt-6 text-lg font-medium text-muted-foreground">
              Step {step} of {totalSteps}: {stepTitles[step - 1]}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* Step 1: Personal Information */}
                {step === 1 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-blue-700">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>First Name *</Label>
                        <Input {...register("firstName")} placeholder="John" />
                        {errors.firstName && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Middle Name</Label>
                        <Input
                          {...register("middleName")}
                          placeholder="Kumar"
                        />
                      </div>
                      <div>
                        <Label>Last Name *</Label>
                        <Input {...register("lastName")} placeholder="Doe" />
                        {errors.lastName && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Date of Birth *</Label>
                        <Input type="date" {...register("dob")} />
                        {errors.dob && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.dob.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Gender *</Label>
                        <Select
                          onValueChange={(v) => setValue("gender", v)}
                          value={watch("gender")}
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
                        {errors.gender && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.gender.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Blood Group</Label>
                        <Select
                          onValueChange={(v) => setValue("bloodGroup", v)}
                          value={watch("bloodGroup")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "A+",
                              "A-",
                              "B+",
                              "B-",
                              "AB+",
                              "AB-",
                              "O+",
                              "O-",
                            ].map((bg) => (
                              <SelectItem key={bg} value={bg}>
                                {bg}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <h4 className="text-xl font-semibold text-blue-700 mt-8">
                      Admission Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Admission Number *</Label>
                        <Input
                          {...register("admissionNumber")}
                          placeholder="ADM2025001"
                        />
                        {errors.admissionNumber && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.admissionNumber.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Admission Date *</Label>
                        <Input type="date" {...register("admissionDate")} />
                        {errors.admissionDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.admissionDate.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Class *</Label>
                        <Select
                          onValueChange={(v) => setValue("class_id", v)}
                          value={watch("class_id")}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                              (n) => (
                                <SelectItem key={n} value={n.toString()}>
                                  Class {n}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        {errors.class_id && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.class_id.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Section *</Label>
                        <Input
                          {...register("section")}
                          placeholder="A"
                          className="uppercase"
                        />
                        {errors.section && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.section.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Roll Number *</Label>
                        <Input {...register("rollNumber")} placeholder="01" />
                        {errors.rollNumber && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.rollNumber.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {step === 2 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-blue-700">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                      <div>
                        <Label>Phone Number *</Label>
                        <Input
                          {...register("phone")}
                          placeholder="9876543210"
                        />
                        {errors.phone && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Alternate Phone</Label>
                        <Input
                          {...register("altPhone")}
                          placeholder="9876543210"
                        />
                        {errors.altPhone && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.altPhone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Email Address *</Label>
                        <Input
                          type="email"
                          {...register("email")}
                          placeholder="student@example.com"
                        />
                        {errors.email && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="max-w-4xl">
                      <Label>Tags (Optional)</Label>
                      <div className="flex flex-wrap gap-3 mt-3">
                        {[
                          "transport",
                          "scholarship",
                          "hostel",
                          "sports",
                          "medical",
                        ].map((tag) => {
                          const selected = watchedTags.includes(tag);
                          return (
                            <button
                              type="button"
                              key={tag}
                              onClick={() =>
                                setValue(
                                  "tags",
                                  selected
                                    ? watchedTags.filter((t) => t !== tag)
                                    : [...watchedTags, tag]
                                )
                              }
                              className={`px-4 py-1.5 rounded-full border text-sm transition ${
                                selected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                              }`}
                            >
                              {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Guardian & Address */}
                {step === 3 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-blue-700">
                      Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>Father's Name *</Label>
                        <Input {...register("fatherName")} />
                        {errors.fatherName && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.fatherName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Mother's Name *</Label>
                        <Input {...register("motherName")} />
                        {errors.motherName && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.motherName.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>Primary Guardian *</Label>
                        <Select
                          onValueChange={(v) => setValue("guardianType", v)}
                          value={watch("guardianType")}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Father">Father</SelectItem>
                            <SelectItem value="Mother">Mother</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Guardian Phone *</Label>
                        <Input
                          {...register("guardianPhone")}
                          placeholder="9876543210"
                        />
                        {errors.guardianPhone && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.guardianPhone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Guardian Email</Label>
                        <Input type="email" {...register("guardianEmail")} />
                        {errors.guardianEmail && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.guardianEmail.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-blue-700 mt-10">
                      Address
                    </h3>
                    <div className="space-y-6 max-w-4xl">
                      <div>
                        <Label>Address Line 1 *</Label>
                        <Input
                          {...register("addressLine1")}
                          placeholder="House no., Street"
                        />
                        {errors.addressLine1 && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.addressLine1.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label>Address Line 2</Label>
                        <Input
                          {...register("addressLine2")}
                          placeholder="Landmark, Apartment"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <Label>City *</Label>
                          <Input {...register("city")} />
                          {errors.city && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>State *</Label>
                          <Input {...register("state")} />
                          {errors.state && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Postal Code *</Label>
                          <Input
                            {...register("postalCode")}
                            placeholder="110001"
                          />
                          {errors.postalCode && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.postalCode.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label>Country</Label>
                          <Input value="India" disabled />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Upload Documents */}
                {/* {step === 4 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-blue-700">
                      Upload Documents
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {documents.map(
                        ({ field, label, noteField, preview, setPreview }) => {
                          const file = watch(field);
                          const isRequired = field === "photo";

                          return (
                            <div key={field} className="space-y-3">
                              <Label>
                                {label} {isRequired && "*"}
                              </Label>

                              <div
                                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:border-blue-500 transition cursor-pointer"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop(
                                  field,
                                  field === "photo" ? setPreview : null
                                )}
                              >
                                <label className="cursor-pointer block">
                                  {file ? (
                                    <div className="space-y-4 text-center">
                                      {field === "photo" && preview && (
                                        <div className="w-full h-48 rounded-lg overflow-hidden border shadow mx-auto">
                                          <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}
                                      {field !== "photo" && (
                                        <div className="w-full h-48 rounded-lg border-2 border-dashed border-green-400 bg-green-50 flex items-center justify-center">
                                          <p className="text-green-700 font-medium">
                                            ✓ {file.name}
                                          </p>
                                        </div>
                                      )}
                                      <p className="text-sm font-medium truncate">
                                        {file.name}
                                      </p>
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          removeFile(
                                            field,
                                            field === "photo"
                                              ? setPreview
                                              : null
                                          )
                                        }
                                      >
                                        <X className="h-4 w-4 mr-1" /> Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-48 space-y-3">
                                      <Upload className="h-12 w-12 text-gray-400" />
                                      <p className="text-sm font-medium">
                                        Click or Drag & Drop
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        JPG, PNG, PDF • Max 5MB
                                      </p>
                                    </div>
                                  )}
                                </label>

                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={handleFileChange(
                                    field,
                                    field === "photo" ? setPreview : null
                                  )}
                                />
                              </div>

                              {errors[field] && (
                                <p className="text-xs text-red-600">
                                  {errors[field]?.message}
                                </p>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )} */}
                {step === 4 && (
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-blue-700">
                      Upload Documents
                    </h3>

                    {/* 🔹 DOCUMENT UPLOAD GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {documents.map(
                        ({ field, label, preview, setPreview }) => {
                          const file = watch(field);
                          const isRequired = field === "photo";

                          return (
                            <div key={field} className="space-y-3">
                              <Label>
                                {label} {isRequired && "*"}
                              </Label>

                              <div
                                className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 bg-gray-50 hover:border-blue-500 transition cursor-pointer"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop(
                                  field,
                                  field === "photo" ? setPreview : null
                                )}
                              >
                                <label className="cursor-pointer block">
                                  {file ? (
                                    <div className="space-y-4 text-center">
                                      {/* Photo */}
                                      {field === "photo" && preview && (
                                        <div className="w-full h-48 rounded-lg overflow-hidden border shadow mx-auto">
                                          <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      )}

                                      {/* Other Docs */}
                                      {field !== "photo" && (
                                        <div className="w-full h-48 rounded-lg border-2 border-dashed border-green-400 bg-green-50 flex items-center justify-center">
                                          <p className="text-green-700 font-medium">
                                            ✓ {file.name}
                                          </p>
                                        </div>
                                      )}

                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={() =>
                                          removeFile(
                                            field,
                                            field === "photo"
                                              ? setPreview
                                              : null
                                          )
                                        }
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-48 space-y-3">
                                      <Upload className="h-12 w-12 text-gray-400" />
                                      <p className="text-sm font-medium">
                                        Click or Drag & Drop
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        JPG, PNG, PDF • Max 5MB
                                      </p>
                                    </div>
                                  )}
                                </label>

                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={handleFileChange(
                                    field,
                                    field === "photo" ? setPreview : null
                                  )}
                                />
                              </div>

                              {errors[field] && (
                                <p className="text-xs text-red-600">
                                  {errors[field]?.message}
                                </p>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>

                    {/* 🔹 ONE COMMON TEXTAREA (FULL WIDTH) */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        CustomFields:{}
                      </Label>

                      <textarea
                        rows={4}
                        placeholder="Enter remarks for all uploaded documents"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        {...register("document_notes")}
                      />

                      {errors.document_notes && (
                        <p className="text-xs text-red-600">
                          {errors.document_notes.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-12 pt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                </Button>

                {step < totalSteps ? (
                  <Button type="button" onClick={nextStep} size="lg">
                    Next <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Admission
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;
