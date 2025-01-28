'use client'

import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function CompletedNotificationComponent({ isSupplier }) {
    return (
    <div className="w-full flex p-4 bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-lg">
        <div className="flex flex-row items-center gap-4">
            <div className="bg-white p-2 rounded-full">
            <CheckCircleIcon className="text-green-500" />
            </div>
            <div className="flex flex-col">
            <h4 className="text-lg font-semibold">Completed Documents</h4>
            { isSupplier?
            (
            <p className="text-sm">
               Everything is up to date and completed. 
            </p>
            ) :
            (
            <p className="text-sm">
               Everything is up to date and completed. The supplier is compliant.
            </p>
            )
            }
            </div>
        </div>
    </div>
    )
}