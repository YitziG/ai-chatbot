import { DoctorpediaPatient } from '@/lib/types';

export function PatientCard({ data }: { data: DoctorpediaPatient }) {
  const { first_name, last_name, email, phone, gender, date_birthday } = data;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-zinc-800 p-4">
      <h2 className="text-xl font-semibold text-white">{`${first_name} ${last_name}`}</h2>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Email:</span>
          <span className="text-white">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Phone:</span>
          <span className="text-white">{phone}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Gender:</span>
          <span className="text-white">{gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Date of Birth:</span>
          <span className="text-white">{date_birthday || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}

export default PatientCard;