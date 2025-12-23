import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ChevronRight, Upload, Home } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { API_BASE_URL } from "../../components/ApiConfig/ApiConfig";
import { Link, useParams, useNavigate } from "react-router-dom";

// Yup Validation Schema
const schema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  role_id: yup.string().required("Role is required"),
  status: yup.string().required("Status is required"),
  password: yup
    .string()
    .required("password is required")
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password too long"),

  confirm_password: yup.string().when("password", {
    is: (value) => value && value.length > 0,
    then: (schema) =>
      schema
        .required("Please confirm your new password")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});

const EditUserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [roles, setRoles] = React.useState([]);
  const [previewImage, setPreviewImage] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [imageFile, setImageFile] = React.useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      role_id: "",
      status: "active",
      password: "",
      confirm_password: "",
    },
  });

  // Watch password to conditionally validate confirm_password
  const password = watch("password");

  // Fetch roles and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesRes = await fetch(`${API_BASE_URL}/api/role`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!rolesRes.ok) throw new Error("Failed to fetch roles");
        const rolesData = await rolesRes.json();
        setRoles(Array.isArray(rolesData) ? rolesData : rolesData.roles || []);

        // Fetch user
        const userRes = await fetch(`${API_BASE_URL}/api/v1/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!userRes.ok) throw new Error("Failed to fetch user");
        const userData = await userRes.json();
        const user = userData.user || userData;

        // Populate form
        setValue("username", user.username || "");
        setValue("email", user.email || "");
        setValue("role_id", user.role_id?.toString() || "");
        setValue("status", user.status || "active");

        setPreviewImage(user.user_profile || null);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to load user data.",
        });
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, setValue, toast, navigate]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Submit handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("role_id", data.role_id);
    formData.append("status", data.status);

    if (data.password) {
      formData.append("password", data.password);
    }

    if (imageFile) {
      formData.append("user_profile", imageFile);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/edit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || err.message || "Failed to update user");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: `${
          result.user?.username || result.username || data.username
        } updated successfully!`,
      });

      navigate("/users");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <Link to="/users" className="text-blue-600 hover:text-blue-700">
          Users
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <span className="font-medium text-gray-700">Edit User</span>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Edit User</CardTitle>
          <p className="text-muted-foreground">
            Update user information, profile picture, and permissions.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Profile Image */}
          <div className="flex justify-left">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={previewImage || ""} alt="User profile" />
                <AvatarFallback className="text-4xl">
                  {watch("username")?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>

              <label htmlFor="user_profile_edit" className="absolute bottom-0 right-0 cursor-pointer">
                <div className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-primary/90 transition">
                  <Upload className="h-5 w-5" />
                </div>
                <input
                  ref={fileInputRef}
                  id="user_profile_edit"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input {...register("username")} placeholder="John Doe" />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register("email")} type="email" placeholder="john@example.com" />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Select onValueChange={(value) => setValue("role_id", value)} defaultValue={watch("role_id")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.role_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("role_id")} />
                {errors.role_id && (
                  <p className="text-sm text-red-600">{errors.role_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select onValueChange={(value) => setValue("status", value)} defaultValue={watch("status")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <input type="hidden" {...register("status")} />
                {errors.status && (
                  <p className="text-sm text-red-600">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>New Password (optional)</Label>
                <Input
                  {...register("password")}
                  type="password"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  {...register("confirm_password")}
                  type="password"
                  placeholder="Confirm new password"
                />
                {errors.confirm_password && (
                  <p className="text-sm text-red-600">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate("/users")}>
                Cancel
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditUserForm;