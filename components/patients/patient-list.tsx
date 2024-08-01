import { DoctorpediaPatient } from '@/lib/types'
import PatientCard from './patient-card'

interface PatientListProps {
  patients: DoctorpediaPatient[]
}

export function PatientList({ patients }: PatientListProps) {
  return (
    <div className="flex flex-col gap-4">
      {patients.length > 0 ? (
        patients.map((patient) => <PatientCard key={patient.id} data={patient} />)
      ) : (
        <div className="text-center text-gray-400">No patients available.</div>
      )}
    </div>
  )
}

export default PatientList