import React, { useState } from "react";
import API from "@/api/axios";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Upload } from "lucide-react";
import { Link2 } from "lucide-react";
import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";

const CreateAssignmentForm = ({ isOpen, isOpenChange }) => {
  const { classId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    marks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  // const [date, setDate] = useState(undefined);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCloseForm = (e) => {
    isOpenChange(false);
    setFormData({ title: "", description: "", dueDate: "", marks: "" });
  };

  const handleCreateAssignment = async () => {
    if (!formData.title) return;

    setIsSubmitting(true);
    try {
      console.log(formData.marks);
      await API.post("/assignments", {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        marks: Number(formData.marks),
        classId,
      });

      setFormData({ title: "", description: "", dueDate: "", marks: "" });
      isOpenChange(false);
    } catch (err) {
      alert("Error creating assignment");
    } finally {
      setIsSubmitting(false);
    }
  };
  const selectedDate = formData.dueDate
    ? new Date(formData.dueDate)
    : undefined;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col h-screen overflow-hidden">
          <div className="sticky inset-x-0 top-0 z-10 flex justify-between h-15 sm:h-17 border-b items-center px-2 py-1 bg-background">
            <div className="flex items-center gap-x-1">
              <div
                className="rounded-2xl p-1 hover:bg-muted-foreground/5 cursor-pointer"
                onClick={handleCloseForm}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
              <h1 className="text-2xl">Assignment</h1>
            </div>
            <Button
              className="cursor-pointer mr-3"
              onClick={handleCreateAssignment}
              disabled={isSubmitting || formData.title.length == 0}
            >
              {isSubmitting && <Spinner />}
              {isSubmitting ? "Assigning..." : "Assign"}
            </Button>
          </div>

          <div className="overflow-y-auto grow px-3 sm:px-5 pb-5 sm:pb-0 min-h-0">
            <div className="flex sm:gap-6 min-h-full flex-col sm:flex-row">
              <div className="sm:w-[73%]">
                <Label
                  htmlFor="assignment-title"
                  className="text-base pt-6 pb-0.5"
                >
                  Title
                </Label>
                <Textarea
                  id="assignment-title"
                  name="title"
                  className="text-base"
                  required
                  rows={5}
                  value={formData.title}
                  onChange={handleChange}
                />

                <Label
                  htmlFor="assignment-description"
                  className="text-base pt-6 pb-0.5"
                >
                  Description (optional)
                </Label>
                <Textarea
                  id="assignmnet-description"
                  name="description"
                  className="text-base"
                  rows={7}
                  value={formData.description}
                  onChange={handleChange}
                />

                <Label className="text-base pt-6 pb-0.5 ">Attach</Label>
                <div className=" border p-7 rounded-xl">
                  <div className="flex gap-5 justify-center">
                    <div className="flex justify-center items-center border h-12 w-12 sm:h-17 sm:w-17 rounded-full hover:bg-foreground/5 cursor-pointer">
                      <Upload />
                    </div>
                    <div className="flex justify-center items-center border h-12 w-12 sm:h-17 sm:w-17 rounded-full hover:bg-foreground/5 cursor-pointer">
                      <Link2 />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sm:border-t-0 sm:border-l sm:w-[27%] sm:px-5 sm:py-5 flex flex-col">
                <Field className="sm:w-44 gap-0.5">
                  <FieldLabel
                    htmlFor="assignment-dueDate"
                    className="text-base pt-6 pb-0.5"
                  >
                    Due Date
                  </FieldLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="assignment-dueDate"
                        className="justify-start font-normal px-3 py-5"
                      >
                        {selectedDate
                          ? selectedDate.toLocaleDateString()
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        captionLayout="dropdown"
                        className="rounded-lg border [--cell-size:--spacing(8)] md:[--cell-size:--spacing(10)]"
                        defaultMonth={selectedDate}
                        onSelect={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            dueDate: selected ? selected.toISOString() : "",
                          }))
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Label
                  htmlFor="assignment-marks"
                  className="text-base pt-6 pb-0.5"
                >
                  Marks
                </Label>
                <Input
                  id="assignment-marks"
                  name="marks"
                  className="text-base sm:w-44 px-3 py-5 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  type="number"
                  value={formData.marks}
                  onChange={(e) => {
                    setFormData({ ...formData, marks: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAssignmentForm;
