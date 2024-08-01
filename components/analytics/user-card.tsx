import { DoctorpediaUser } from '@/lib/types';

export function UserCard({ data }: { data: DoctorpediaUser }) {
  const { first_name, last_name, place_of_work, title, area_practice, email, avatar } = data;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-zinc-800 p-4">
      <h2 className="text-xl font-semibold text-white">{`${first_name} ${last_name}`}</h2>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Title:</span>
          <span className="text-white">{title.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Area of Practice:</span>
          <span className="text-white">{area_practice.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Place of Work:</span>
          <span className="text-white">{place_of_work}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Email:</span>
          <span className="text-white">{email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Avatar:</span>
          <img src={avatar} alt="Avatar" className="size-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default UserCard;