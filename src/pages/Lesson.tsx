import { Link, useParams } from "react-router-dom";
import { courses } from "../data/courses";


export default function Lesson() {
    const { courseId, lessonId } = useParams();

    const course = courses.find(c => c.id === Number(courseId));
    const lesson = course?.lessons.find(l => l.id === Number(lessonId));

    if (!lesson) return <h2>Lesson not found</h2>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>{lesson.title}</h1>
            <p>{lesson.content}</p>
            <Link to={`/quiz/${courseId}/${lessonId}`}>
                Take Quiz
            </Link>
        </div>
    );
}