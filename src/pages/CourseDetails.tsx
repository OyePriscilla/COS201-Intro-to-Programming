import { useParams, Link } from "react-router-dom";
import { courses } from "../data/courses";

export default function CourseDetails() {
  const { id } = useParams();
  const course = courses.find(c => c.id === Number(id));

  if (!course) return <h2>Course not found</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{course.title}</h1>
      <p>{course.description}</p>

      <h3>Lessons</h3>
      {course.lessons.map(lesson => (
        <div key={lesson.id}>
          <Link to={`/lesson/${course.id}/${lesson.id}`}>
            {lesson.title}
          </Link>
        </div>
      ))}
    </div>
  );
}