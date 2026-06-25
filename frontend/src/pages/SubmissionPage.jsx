import API from "@/api/axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

const SubmissionPage = () => {
  const { classId, assignmentId } = useParams();
  const [assignmentData, setAssignmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await API.get(`/assignments/${assignmentId}`);
        setAssignmentData(res.data);
      } catch (error) {
        console.error("fetching assignment details failed", error);
        setError("Error fetching assignment details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!answer.trim()) {
      setSubmitError("Please enter your answer before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post(`/assignments/${assignmentId}/submissions`, {
        answer: answer.trim(),
      });
      setSuccessMessage("Assignment submitted successfully.");
      setAnswer("");
    } catch (submissionError) {
      console.error("submission failed", submissionError);
      setSubmitError(
        submissionError.response?.data?.message ||
          "Failed to submit assignment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedDueDate = assignmentData?.dueDate
    ? new Date(assignmentData.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <div className="max-w-4xl mx-auto px-2 py-6 sm:px-4">
      {isLoading ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          Loading assignment...
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-6 text-center text-sm text-destructive">
          {error}
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div className=" sm:items-center sm:justify-between">
              <h2 className="text-xl sm:text-2xl text-foreground">
                {assignmentData?.title}
              </h2>

              <div className="flex gap-2 items-center">
                <div className="py-2 text-sm text-foreground">
                  Due {formattedDueDate}
                </div>

                <p className="text-sm text-foreground">
                  {assignmentData.marks != null &&
                    `| ${assignmentData.marks} marks`}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                {assignmentData?.description}
              </p>
            </div>
            <Separator />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 pt-6">
            <div className="space-y-2">
              <label
                htmlFor="assignment-answer"
                className="text-base font-medium text-foreground"
              >
                Your answer
              </label>
              <Textarea
                id="assignment-answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type your submission here..."
                className="min-h-45 mt-0.5"
                disabled={isSubmitting}
              />
            </div>

            {submitError && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {submitError}
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={isSubmitting || !answer.trim()}>
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default SubmissionPage;
