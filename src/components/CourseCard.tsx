import { Link } from "react-router-dom";

interface Props {
  id: number;
  title: string;
  description: string;
}

export default function CourseCard({ id, title, description }: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", margin: "10px" }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={`/course/${id}`}>Start Course</Link>
    </div>
  );
}