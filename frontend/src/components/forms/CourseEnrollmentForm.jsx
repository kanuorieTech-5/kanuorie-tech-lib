import { Button, Card } from "../ui";

export default function CourseEnrollmentForm({
  course,
  enrolled = false,
  loading = false,
  onEnroll,
}) {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold">{course?.title}</h3>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {course?.description}
      </p>

      <Button
        className="mt-6"
        disabled={enrolled}
        loading={loading}
        onClick={() => onEnroll?.(course)}
      >
        {enrolled ? "Already Enrolled" : "Enroll Now"}
      </Button>
    </Card>
  );
}
