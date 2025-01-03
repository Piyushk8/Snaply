import ClientCldImage from '@/components/CldImage'
import { notificationsData } from '@/lib/types'
import React from 'react'

interface NotificationComponentProps {
    notification: notificationsData
}

const NotificationComponent = ({ notification }: NotificationComponentProps) => {
    if (notification?.type === "LIKE") {
        return (
            <div className="flex w-full items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-4 gap-4 border border-gray-200 shadow-sm">
                <div className="flex-shrink-0">
                    <ClientCldImage src={notification?.issuer?.image} classname="rounded-full w-12 h-12" />
                </div>
                <div>
                    <span className="font-semibold text-gray-800">{notification?.issuer?.name}</span>
                    <span className="text-gray-600"> liked your post</span>
                </div>
            </div>
        )
    }
    if (notification?.type === "COMMENT") {
        return (
            <div className="flex w-full items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-4 gap-4 border border-gray-200 shadow-sm">
                <div className="flex-shrink-0">
                    <ClientCldImage src={notification?.issuer?.image} classname="rounded-full w-12 h-12" />
                </div>
                <div>
                    <span className="font-semibold text-gray-800">{notification?.issuer?.name}</span>
                    <span className="text-gray-600"> commented on your post</span>
                </div>
            </div>
        )
    }
    return null
}

export default NotificationComponent
