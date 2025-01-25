import ClientCldImage from '@/components/CldImage'
import { notificationsData } from '@/lib/types'
import React from 'react'

interface NotificationComponentProps {
    notification: notificationsData
}

const NotificationComponent = ({ notification }: NotificationComponentProps) => {
    if (notification?.type === "LIKE") {
        return (
            <div className={`${notification?.read===false && "bg-card dark:border border-border"} bg-card dark:border border-border flex w-full items-center  transition-colors rounded-xl p-4 gap-4 border text-primary shadow-sm`}>
                <div className="flex-shrink-0">
                    <ClientCldImage src={notification?.issuer?.image} classname="rounded-full w-12 h-12" />
                </div>
                <div>
                    <span className="font-semibold text-card-foreground">{notification?.issuer?.name}</span>
                    <span className=""> liked your post</span>
                </div>
            </div>
        )
    }
    if (notification?.type === "COMMENT") {
        return (
            <div className={`${notification?.read===false && "bg-card dark:border border-border"} flex w-full items-center bg-card dark:border border-border transition-colors rounded-xl p-4 gap-4 border shadow-sm `}>
                <div className="flex-shrink-0">
                    <ClientCldImage src={notification?.issuer?.image} classname="rounded-full w-12 h-12" />
                </div>
                <div>
                    <span className="font-semibold text-card-foreground">{notification?.issuer?.name}</span>
                    <span className="text-primary"> replied to your post</span>
                </div>
            </div>
        )
    }

    if(notification?.type==="FOLLOW"){
        return (
            <div className={`${notification?.read===false && "bg-card dark:border border-border"} flex w-full items-center bg-card dark:border border-border transition-colors rounded-xl p-4 gap-4 border shadow-sm`}>
            <div className="flex-shrink-0">
                <ClientCldImage src={notification?.issuer?.image} classname="rounded-full w-12 h-12" />
            </div>
            <div>
                <span className="font-semibold text-primary">{notification?.issuer?.name}</span>
                <span className="text-card-foreground"> Started following you!</span>
            </div>
        </div>)
    }

    return null
}

export default NotificationComponent
