import Image from "next/image";

export default function CourseCard({ title, instructor, rating, students, hours, tags, image }) {
  
  return (
    <div className="rounded-lg shadow p-4 bg-white">
      <Image
        src={image}
        alt={title}
        width={400}
        height={200}
        className="rounded-md object-cover"
      />
      <h3 className="mt-2 font-bold">{title}</h3>
      <p className="text-sm text-gray-600">por {instructor}</p>
      <div className="text-xs text-gray-500">
        ⭐ {rating} · {students} alumnos · {hours} horas
      </div>
    </div>
  );
}
